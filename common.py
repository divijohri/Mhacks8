import pymssql

server = "detroit-crimes-data.database.windows.net"
database = "detroit-crimes-data"
username = "mhacks@detroit-crimes-data"
password = "hype!!11"

def get_conn():
    conn = pymssql.connect(
            server=server,
            user=username,
            password=password,
            database=database)
    return conn

def close_conn(conn):
    conn.close()

def fetch_one(query, parameters):
    conn = get_conn()
    cur = conn.cursor()
    #print cur.mogrify(query, parameters)
    cur.execute(query, parameters)
    result = cur.fetchone()
    cur.close()
    close_conn(conn)
    return result

def fetch_all(query, parameters):
    conn = get_conn()
    cur = conn.cursor()
    #print cur.mogrify(query, parameters)
    cur.execute(query, parameters)
    result = cur.fetchall()
    cur.close()
    close_conn(conn)
    return result

def commit(query, parameters):
    conn = get_conn()
    cur = conn.cursor()
    #print cur.mogrify(query, parameters)
    cur.execute(query, parameters)
    cur.close()
    conn.commit()
    close_conn(conn)
