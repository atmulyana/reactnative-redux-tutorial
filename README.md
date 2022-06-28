# React Native - Redux Tutorial
It's a simple client-server application which does CRUD operation.   
The client uses React Native - Redux.   
The server uses Nodejs - express and SQL Server database.   

## Note for server
Please change `dbConf` in `index.js` according to your database server config.
For database content, please restore the backup file `server/db/db.bak`  
On non Windows OS, please install ODBC 17 driver before executing `npm install`. Here are the steps for installing ODBC 17 driver on MacOS:

        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        brew tap microsoft/mssql-release https://github.com/Microsoft/homebrew-mssql-release
        brew update
        HOMEBREW_NO_ENV_FILTERING=1 ACCEPT_EULA=Y brew install msodbcsql17 mssql-tools

How to install ODBC 17 driver on Linux can be found [here](https://docs.microsoft.com/en-us/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server?view=sql-server-ver15#17).   
   
If you want to install SQL Server on MacOS, please consider using SQL Server for Docker.