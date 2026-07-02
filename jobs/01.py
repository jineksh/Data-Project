from pyspark.sql import SparkSession


spark = (
    SparkSession.builder.appName('BajajFinanceData').master("spark://spark-master:7077").getOrCreate()
)

print("Spark Builder Object is Created")


df = spark.read.csv(
    "/opt/spark/data/bajaj-2003-2020.csv",
    header=True,
    inferSchema=True
)

df = df.filter(df["High Price"] < 40)

