# Testing Guide

## Prerequisites

Before running tests, ensure you have:

1. **MongoDB running** - Either:
   - Local MongoDB instance running on `localhost:27017`, OR
   - MongoDB Atlas connection string set in `MONGODB_URI` environment variable

2. **Environment Variables** (optional - defaults provided):
   - `JWT_SECRET` - Defaults to test secret if not set
   - `MONGODB_URI` - Defaults to `mongodb://localhost:27017/test-user-management` if not set

## Running Tests

```bash
cd backend
npm test
```

## Test Setup

The test suite automatically:
- Sets `NODE_ENV=test`
- Configures default JWT_SECRET for testing
- Connects to test database
- Cleans up data between tests

## MongoDB Connection

If you don't have MongoDB running locally, you can:

1. **Use MongoDB Atlas** (Recommended for CI/CD):
   ```bash
   export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/test-user-management"
   npm test
   ```

2. **Install MongoDB locally**:
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

3. **Use Docker**:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo
   npm test
   ```

## Troubleshooting

### Connection Timeout
If tests timeout connecting to MongoDB:
- Check if MongoDB is running: `mongosh` or `mongo`
- Verify connection string in `MONGODB_URI`
- Check firewall/network settings

### JWT_SECRET Errors
If you see JWT_SECRET errors:
- The test setup should handle this automatically
- If issues persist, set `JWT_SECRET` in environment

### Test Failures
- Ensure MongoDB is accessible
- Check that test database is writable
- Review error messages for specific issues

## Test Coverage

The test suite includes:
- **Authentication Tests** (9 tests): Signup, login, token validation
- **User Management Tests** (5 tests): Profile management, password change
- **Admin Tests** (7 tests): User listing, activate/deactivate

Total: **21 test cases**

