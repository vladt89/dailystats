import {Database, open} from "sqlite";
import sqlite3 from "sqlite3";

export class DatabaseService {

    private dbPromise: Promise<Database>;
    
    constructor() {
        this.dbPromise = this.initializeDatabase();
    }

    private async getDb(): Promise<Database> {
        return this.dbPromise;
    }
    
    async initializeDatabase(): Promise<Database> {
        const db = await open({
            filename: 'mydb.sqlite',
            driver: sqlite3.Database,
        });
        
        await this.initializeBrands(db);
        await this.initializeAsins(db);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS listings
            (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                marketplace TEXT    NOT NULL,
                state       TEXT    NOT NULL,
                asin_id     INTEGER NOT NULL
            );
        `);
        
        await db.exec(`
            CREATE TABLE IF NOT EXISTS dailyStats
            (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                sold_items INTEGER,
                listing_id INTEGER NOT NULL
            );
        `);

        // Close the database
        // await db.close();
        return db;
    }

    private async initializeAsins(db: Database) {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS asins
            (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                asin         TEXT    NOT NULL UNIQUE,
                product_name TEXT    NOT NULL,
                amount       INTEGER NOT NULL,
                brand_id     INTEGER NOT NULL
            );
        `);

        await db.run('DELETE FROM asins');

        const nikeBrand = await db.get('SELECT id FROM brands WHERE name = ?', ['Nike']);
        await db.run('INSERT INTO asins (asin, product_name, amount, brand_id) VALUES (?, ?, ?, ?)',
            ['B07F8Z4TWW', 'Nike Star Runner 4', 40, nikeBrand.id]);
    }

    private async initializeBrands(db: Database) {
        try {
            await db.exec(`
                CREATE TABLE IF NOT EXISTS brands
                (
                    id    INTEGER PRIMARY KEY AUTOINCREMENT,
                    name  TEXT NOT NULL UNIQUE,
                    email TEXT NOT NULL
                );
            `);

            await db.run('DELETE FROM brands');

            await db.run('INSERT INTO brands (name, email) VALUES (?, ?)', ['Nike', 'nike@example.com']);
            await db.run('INSERT INTO brands (name, email) VALUES (?, ?)', ['Adidas', 'adidas@example.com']);
            await db.run('INSERT INTO brands (name, email) VALUES (?, ?)', ['Hoka', 'hoka@example.com']);
        } catch (e: any) {
            console.log("fail to initialize brands: " + e.message);
        }
    }

    async fetchBrandIdByName(name: string) {
        const db = await this.getDb();
        let brandId;
        try {
            brandId = await db.get('SELECT id FROM brands WHERE name = ?', [name]);
        } catch (e) {
            console.log("Failed to fetch brand id by name");
        }
        return brandId;
    }
    
    async fetchAllBrands() {
        const db = await this.getDb();
        return db.all('SELECT * FROM brands');
    }

    async fetchAllStats() {
        const db = await this.getDb();
        return db.all('SELECT * FROM dailyStats');
    }
}
