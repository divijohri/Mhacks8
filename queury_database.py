import common

query = """
SELECT *
FROM Buddies WHERE id = %s
"""

print common.fetch_one(query, (1158914194190947))
