import common

query = """
CREATE TABLE Buddies (
id bigint,
lat float(24),
long float(24),
time datetime
);
"""

common.commit(query, ())
