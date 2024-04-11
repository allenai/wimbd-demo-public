"""

psql postgresql://foo:bar@db/wimbd?sslmode=disable


create index on c4 (url);
"""

import argparse
import pandas as pd
from sqlalchemy import create_engine


def main():
    parser = argparse.ArgumentParser(description='Create a table from a CSV file.')
    
    parser.add_argument('--filename', type=str, help='Name of the CSV file')
    parser.add_argument('--tablename', type=str, help='Name of the table to create')
    
    args = parser.parse_args()

    df = pd.read_csv(args.filename)
    df.columns = [c.lower() for c in df.columns] # PostgreSQL doesn't like capitals or spaces

    # engine = create_engine('postgresql://foo:bar@db/wimbd?sslmode=disable')
    engine = create_engine('postgresql://postgres:[1ZSB3Ni|^|b|Xvo@localhost:9470/wimbd')

    df.to_sql(args.tablename, engine)

if __name__ == '__main__':
    main()
