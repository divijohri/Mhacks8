import common

query = """
SELECT *
FROM Buddies
"""

print common.fetch_all(query, ())
