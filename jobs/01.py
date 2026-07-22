
from pyspark.sql import SparkSession
from pyspark.sql.functions import avg,max,min,count,when,lower,regexp_replace

import time

spark = (
    SparkSession.builder.appName('BajajFinanceData').master("spark://spark-master:7077").getOrCreate()
)

print("Spark Builder Object is Created")


df = spark.read.csv(
    "/opt/spark/data/bajaj-2003-2020.csv",
    header=True,
    inferSchema=True
)

new_df = df.withColumn(
    "Total Traded Quantity",
    regexp_replace(df["Total Traded Quantity"],",","")   
)

