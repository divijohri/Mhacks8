import common

query = """
CREATE TABLE Buddies (
id bigint,
name varchar(max),
picture varchar(max),
lat float(24),
lng float(24),
time datetime
);
"""

common.commit(query, ())
