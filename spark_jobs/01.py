from functools import reduce

from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.functions import (
    col,
    upper,
    trim,
    regexp_replace,
    lit,
    monotonically_increasing_id,
)

spark = (
    SparkSession.builder
    .appName("STOCKMARKETDATA")
    .master("spark://spark-master:7077")
    .config("spark.jars", "/opt/spark/jobs/postgresql-42.7.3.jar")
    .getOrCreate()
)

DB_HOST = "data_val_postgres"
DB_PORT = "5432"
DB_NAME = "data_validation_db"
DB_USER = "postgres"
DB_PASS = "mysecretpassword"

JDBC_URL = f"jdbc:postgresql://{DB_HOST}:{DB_PORT}/{DB_NAME}"
MONGO_URI = "mongodb://mongodb:27017/"

TARGET_DATASET_ID = 1

def query_postgres(sql_query: str):
    wrapped_query = f"({sql_query}) AS temp_table"
    return spark.read \
        .format("jdbc") \
        .option("url", JDBC_URL) \
        .option("dbtable", wrapped_query) \
        .option("user", DB_USER) \
        .option("password", DB_PASS) \
        .option("driver", "org.postgresql.Driver") \
        .load()

try:
    print(f"\n[STEP 1] Fetching dataset details for dataset_id = {TARGET_DATASET_ID}...")
    dataset_df = query_postgres(f'SELECT id, name, \"baseName\" FROM datasets WHERE id = {TARGET_DATASET_ID}')
    dataset_rows = dataset_df.collect()

    if not dataset_rows:
        raise Exception(f"Dataset with ID {TARGET_DATASET_ID} not found in DB!")

    file_name = dataset_rows[0]["name"]
    base_name = dataset_rows[0]["baseName"]
    print(f" Dataset Name Found: '{file_name}', baseName: '{base_name}'")

    print(f"\n[STEP 2] Fetching ALL active validation rules for dataset_id = {TARGET_DATASET_ID}...")
    rules_df = query_postgres(
        f"SELECT id AS rule_id, rule, status FROM validation_rules WHERE dataset_id = {TARGET_DATASET_ID} AND status = 'ACTIVE'"
    )
    rules_list = rules_df.collect()

    if not rules_list:
        raise Exception(f"No ACTIVE rules found for dataset_id = {TARGET_DATASET_ID}")

    print(f" Found {len(rules_list)} active rule(s) for this dataset.")

    input_file_path = f"/opt/spark/data/{file_name}"
    print(f"\n[STEP 3 & 4] Reading raw data from {input_file_path}...")

    df = spark.read.csv(input_file_path, header=True, inferSchema=True)
    df = df.toDF(*[c.strip().lower().replace(" ", "_").replace(".", "") for c in df.columns])

    if "id" not in df.columns:
        df = df.withColumn("row_id", monotonically_increasing_id() + 1)
    else:
        df = df.withColumnRenamed("id", "row_id")

    
    df.createOrReplaceTempView(f"`{base_name}`")
    print(f"📌 Registered Temporary SQL View: `{base_name}`")

    print("\n[STEP 5 & 6] Executing validation rules...")

    all_invalid_dfs = []

    for idx, rule_row in enumerate(rules_list, 1):
        r_id = rule_row["rule_id"]
        r_sql = rule_row["rule"]

        
        sanitized_sql = r_sql
        if base_name in sanitized_sql and f"`{base_name}`" not in sanitized_sql:
            sanitized_sql = sanitized_sql.replace(base_name, f"`{base_name}`")

        print(f"\n ⚙️ Executing Rule #{idx} (ID: {r_id}):\n    ➜ SQL: {sanitized_sql}")

        # Rule SQL gives VALID rows
        rule_valid_df = spark.sql(sanitized_sql)

        # FIX #3: Invalid rows = Main DF minus Valid rows
        rule_invalid_df = df.subtract(rule_valid_df)

        tagged_invalid_df = rule_invalid_df \
            .withColumn("dataset_id", lit(TARGET_DATASET_ID)) \
            .withColumn("failed_rule_id", lit(r_id)) \
            .withColumn("failed_rule_sql", lit(r_sql))

        all_invalid_dfs.append(tagged_invalid_df)

    # Combine all bad rows
    combined_invalid_df = reduce(DataFrame.unionByName, all_invalid_dfs)

    raw_invalid_rows = combined_invalid_df.drop("dataset_id", "failed_rule_id", "failed_rule_sql")

    valid_df = df.subtract(raw_invalid_rows)

    print("\n[STEP 7] Cleaning & Standardizing Valid Data...")

    valid_df = valid_df.dropDuplicates()

    if "symbol" in valid_df.columns:
        valid_df = valid_df.withColumn("symbol", upper(trim(col("symbol"))))

    if "no_of_trades" in valid_df.columns:
        valid_df = valid_df.fillna({"no_of_trades": 0})

    if "total_traded_quantity" in valid_df.columns:
        valid_df = valid_df.withColumn(
            "total_traded_quantity", regexp_replace(col("total_traded_quantity"), ",", "")
        )

    double_columns = ["open_price", "high_price", "low_price", "close_price", "average_price", "turnover"]
    long_columns = ["total_traded_quantity", "no_of_trades"]

    for c in double_columns:
        if c in valid_df.columns:
            valid_df = valid_df.withColumn(c, col(c).cast("double"))

    for c in long_columns:
        if c in valid_df.columns:
            valid_df = valid_df.withColumn(c, col(c).cast("long"))

    mandatory_columns = [
        c
        for c in ["symbol", "date", "open_price", "high_price", "low_price", "close_price"]
        if c in valid_df.columns
    ]
    valid_df = valid_df.dropna(subset=mandatory_columns)

    valid_count = valid_df.count()
    invalid_count = combined_invalid_df.count()

    print("\n[STEP 8] Storing Outputs...")

   

    print("\n" + "="*50)
    print(f"📊 PIPELINE SUMMARY FOR DATASET #{TARGET_DATASET_ID}")
    print("="*50)
    print(f"Total Rules Applied : {len(rules_list)}")
    print(f"Total Input Rows    : {df.count()}")
    print(f"Valid Rows Saved    : {valid_count} (Saved in RAW CSV)")
    print(f"Invalid Rows Saved  : {invalid_count} (Saved in MongoDB)")
    print("="*50)

except Exception as e:
    print("\n❌ PIPELINE EXECUTION ERROR:", e)

finally:
    spark.stop()