"""
drift_recovery.py
Python alternative to clear stuck system drifts, flush order locks,
and restore live Binance chart synchronization.
Run: python drift_recovery.py
"""
import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environmental database URI variables
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    print("💥 Error: MONGO_URI not found in your .env file!")
    sys.exit(1)

def run_recovery():
    try:
        print("⚡ SWANCORE ENGINE: Initializing Python Drift Recovery Handshake...")
        client = MongoClient(mongo_uri)
        db = client.get_default_database()
        print("✅ Connected safely to MongoDB database.")

        # 1. Force release any locked funds held by "stuck" processing orders
        print("\nStep 1: Auditing pending order queues...")
        open_orders_collection = db["orders"] # adjust if your collection name differs
        open_orders_count = open_orders_collection.count_documents({"status": "open"})

        if open_orders_count > 0:
            print(f"⚠️  Found {open_orders_count} open orders blocking your USDT available balance.")
            open_orders_collection.update_many(
                {"status": "open"},
                {"$set": {"status": "cancelled"}}
            )
            print("✅ Cleaned order queues. All hanging user funds unlocked.")
        else:
            print("✅ No lingering open orders found.")

        # 2. Re-synchronize Spot Wallet schemas back to pure balances
        print("\nStep 2: Syncing database balances...")
        users_collection = db["users"]
        wallets_collection = db["wallets"]
        
        users = users_collection.find()
        for user in users:
            core_balance = user.get("balance", 0)
            user_id = user.get("_id")
            user_email = user.get("email", "Unknown")

            # Update the wallet mapping, forcefully setting locked funds to zero
            wallets_collection.update_one(
                {"userId": user_id, "type": "spot"},
                {
                    "$set": {
                        "availableBalance": core_balance,
                        "lockedBalance": 0,
                        "borrowedBalance": 0,
                        "unrealizedPnl": 0,
                        "equity": core_balance
                    }
                },
                upsert=True
            )
            print(f" ✨ Restored wallet connection for: {user_email} -> Available Balance: ${core_balance}")

        print("\n🚀 RECOVERY COMPLETE: Engine states have successfully reverted to natural balances!")
        print("👉 ACTION REQUIRED: Restart your main Node.js server application now (node server.js)")
        client.close()
        
    except Exception as e:
        print(f"💥 Critical breakdown during recovery routine: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    run_recovery()