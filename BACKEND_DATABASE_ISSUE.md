# Backend Database Issue - GetCommands Endpoint

## 🚨 **Critical Issue Found**

The `/GetCommands` endpoint is failing with a **400 Bad Request** error due to a **database schema mismatch**.

## 📋 **Error Details**

**Error Message:**
```
"sql: Scan error on column index 0, name \"id\": converting driver.Value type []uint8 (\"0077d460-8764-4318-88a4-0a66f1da93db\") to a int: invalid syntax"
```

**Root Cause:**
- The database column `id` is defined as an **integer** type
- But the actual data contains **UUID values** (strings like "0077d460-8764-4318-88a4-0a66f1da93db")
- The backend code is trying to scan UUID strings into an integer field

## 🔧 **Backend Fix Required**

### Option 1: Change Database Schema (Recommended)
```sql
-- Change the id column from INT to UUID/VARCHAR
ALTER TABLE commands ALTER COLUMN id TYPE VARCHAR(36);
-- or
ALTER TABLE commands ALTER COLUMN id TYPE UUID;
```

### Option 2: Update Backend Code
If you want to keep the integer ID, update the backend code to:
1. Generate integer IDs instead of UUIDs
2. Or handle the conversion properly in the Go code

### Option 3: Use Auto-incrementing Integer IDs
```sql
-- Make id auto-incrementing integer
ALTER TABLE commands ALTER COLUMN id TYPE SERIAL;
```

## 📊 **Current Database Structure**

Based on the working `/CreateCommand` endpoint, the table structure appears to be:
```sql
CREATE TABLE commands (
    id VARCHAR(36) PRIMARY KEY,  -- Should be UUID/VARCHAR, not INT
    fullname VARCHAR(255),
    number VARCHAR(20),
    flor VARCHAR(10),
    itemtype VARCHAR(100),
    service TEXT,
    workers VARCHAR(10),
    start VARCHAR(255),
    distination VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 **Testing**

The issue can be reproduced by:
1. Making a GET request to `https://gokrixo.onrender.com/GetCommands`
2. The endpoint returns 400 with the SQL scan error
3. `/GetWorkers` works fine (no database issue there)

## 🎯 **Priority**

**HIGH PRIORITY** - This prevents the admin panel from displaying commands data.

## 📞 **Contact**

Please fix this database schema issue in the backend. The frontend is now handling this gracefully with sample data, but the real data cannot be retrieved until this is fixed.

---

**Note:** The `/CreateCommand` endpoint works fine, so new commands are being created successfully. The issue is only with retrieving existing commands. 