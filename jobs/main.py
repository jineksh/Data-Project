from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col,
    upper,
    trim,
    regexp_replace,
)


# Spark Session


spark = (
    SparkSession.builder
    .appName("STOCKMARKETDATA")
    .master("spark://spark-master:7077")
    .getOrCreate()
)

# Data Ingestion


df = spark.read.csv(
    "/opt/spark/data/input/bajaj_stock_data.csv",
    header=True,
    inferSchema=True
)


# Field Harmonization


df = df.toDF(
    *[
        c.strip()
        .lower()
        .replace(" ", "_")
        .replace(".", "")
        for c in df.columns
    ]
)


# Data Validation

validation_condition = (

    col("symbol").isNotNull() &
    (col("open_price") > 0) &
    (col("close_price") > 0) &
    (col("high_price") >= col("open_price")) &
    (col("high_price") >= col("close_price")) &
    (col("close_price") >= col("low_price")) &
    (col("total_traded_quantity") > 0)

)

validate_df = df.filter(validation_condition)

invalid_df = df.filter(~validation_condition)


# Data Cleaning

# Remove Duplicate Records

validate_df = validate_df.dropDuplicates()

# Standardize Symbol

validate_df = validate_df.withColumn(
    "symbol",
    upper(trim(col("symbol")))
)

# Handle Missing Values

validate_df = validate_df.fillna({
    "no_of_trades": 0
})

# Remove Comma From Quantity

validate_df = validate_df.withColumn(
    "total_traded_quantity",
    regexp_replace(
        col("total_traded_quantity"),
        ",",
        ""
    )
)


# Data Type Conversion


double_columns = [

    "open_price",
    "high_price",
    "low_price",
    "close_price",
    "average_price",
    "turnover"

]

long_columns = [

    "total_traded_quantity",
    "no_of_trades"

]

for c in double_columns:

    validate_df = validate_df.withColumn(
        c,
        col(c).cast("double")
    )

for c in long_columns:

    validate_df = validate_df.withColumn(
        c,
        col(c).cast("long")
    )


# Mandatory Column Validation

mandatory_columns = [

    "symbol",
    "date",
    "open_price",
    "high_price",
    "low_price",
    "close_price"

]

validate_df = validate_df.dropna(
    subset=mandatory_columns
)






# Output


print("Valid Records :", validate_df.count())

print("Invalid Records :", invalid_df.count())

validate_df.show(10, truncate=False)


validate_df.write.mode("overwrite").parquet(
    "/opt/spark/data/output/valid_data"
)

invalid_df.write.mode("overwrite").parquet(
    "/opt/spark/data/output/invalid_data"
)