import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import 'dotenv/config';
import { Pool } from 'pg';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private pool1 = new Pool({
    connectionString: process.env.DATABASE_URL_1,
  });

  private pool2 = new Pool({
    connectionString: process.env.DATABASE_URL_2,
  });

  async onModuleInit() {
    const client1 = await this.pool1.connect();
    await client1.query('SELECT 1');
    client1.release();

    const client2 = await this.pool2.connect();
    await client2.query('SELECT 1');
    client2.release();
    
    console.log('✅ Conectado a PostgreSQL Practica1 y Practica1_DB2');
  }

  async onModuleDestroy() {
    await this.pool1.end();
    await this.pool2.end();
  }

  getHello(): string {
    return 'Hello World!';
  }

  // User CRUD
  async createUser(email: string, name: string, age?: number, bio?: string) {
    const result = await this.pool1.query(
      'INSERT INTO "User" (email, name, age, bio) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, name, age, bio],
    );
    return result.rows[0];
  }

  async getAllUsers() {
    const result = await this.pool1.query('SELECT id, email, name, age, bio FROM "User" ORDER BY id');
    return result.rows;
  }

  async getUserById(id: number) {
    const result = await this.pool1.query('SELECT id, email, name, age, bio FROM "User" WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async updateUser(id: number, email?: string, name?: string, age?: number, bio?: string) {
    const result = await this.pool1.query(
      'UPDATE "User" SET email = COALESCE($1, email), name = COALESCE($2, name), age = COALESCE($3, age), bio = COALESCE($4, bio) WHERE id = $5 RETURNING id, email, name, age, bio',
      [email, name, age, bio, id],
    );
    return result.rows[0] || null;
  }

  async deleteUser(id: number) {
    const result = await this.pool1.query('DELETE FROM "User" WHERE id = $1 RETURNING id, email, name, age, bio', [id]);
    return result.rows[0] || null;
  }

  // Music CRUD
  async createMusic(title: string, artist: string, genre?: string) {
    const result = await this.pool2.query(
      'INSERT INTO "Music" (title, artist, genre) VALUES ($1, $2, $3) RETURNING *',
      [title, artist, genre],
    );
    return result.rows[0];
  }

  async getAllMusic() {
    const result = await this.pool2.query('SELECT id, title, artist, genre FROM "Music" ORDER BY id');
    return result.rows;
  }

  async getMusicById(id: number) {
    const result = await this.pool2.query('SELECT id, title, artist, genre FROM "Music" WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async updateMusic(id: number, title?: string, artist?: string, genre?: string) {
    const result = await this.pool2.query(
      'UPDATE "Music" SET title = COALESCE($1, title), artist = COALESCE($2, artist), genre = COALESCE($3, genre) WHERE id = $4 RETURNING id, title, artist, genre',
      [title, artist, genre, id],
    );
    return result.rows[0] || null;
  }

  async deleteMusic(id: number) {
    const result = await this.pool2.query('DELETE FROM "Music" WHERE id = $1 RETURNING id, title, artist, genre', [id]);
    return result.rows[0] || null;
  }

  // Like
  async createLike(likerId: number, likedId: number) {
    // Check if already liked
    const existing = await this.pool1.query('SELECT id FROM "Like" WHERE "likerId" = $1 AND "likedId" = $2', [likerId, likedId]);
    if (existing.rows.length > 0) throw new Error('Already liked');

    const result = await this.pool1.query(
      'INSERT INTO "Like" ("likerId", "likedId") VALUES ($1, $2) RETURNING *',
      [likerId, likedId],
    );

    // Check for match
    const mutual = await this.pool1.query('SELECT id FROM "Like" WHERE "likerId" = $1 AND "likedId" = $2', [likedId, likerId]);
    if (mutual.rows.length > 0) {
      // Create match
      const [user1Id, user2Id] = likerId < likedId ? [likerId, likedId] : [likedId, likerId];
      await this.pool1.query(
        'INSERT INTO "Match" ("user1Id", "user2Id") VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [user1Id, user2Id],
      );
    }

    return result.rows[0];
  }

  async getLikesForUser(userId: number) {
    const result = await this.pool1.query(
      'SELECT l.id, l."likerId", u.name, u.age, u.bio FROM "Like" l JOIN "User" u ON l."likerId" = u.id WHERE l."likedId" = $1',
      [userId],
    );
    return result.rows;
  }

  // Match
  async getMatchesForUser(userId: number) {
    const result = await this.pool1.query(
      `SELECT m.id, m."user1Id", m."user2Id", u1.name as user1Name, u1.age as user1Age, u1.bio as user1Bio, u2.name as user2Name, u2.age as user2Age, u2.bio as user2Bio
       FROM "Match" m
       JOIN "User" u1 ON m."user1Id" = u1.id
       JOIN "User" u2 ON m."user2Id" = u2.id
       WHERE m."user1Id" = $1 OR m."user2Id" = $1`,
      [userId],
    );
    return result.rows;
  }

  // Message
  async sendMessage(matchId: number, senderId: number, content: string) {
    // Verify sender is in match
    const match = await this.pool1.query('SELECT "user1Id", "user2Id" FROM "Match" WHERE id = $1', [matchId]);
    if (match.rows.length === 0 || (match.rows[0].user1Id !== senderId && match.rows[0].user2Id !== senderId)) {
      throw new Error('Not authorized');
    }

    const result = await this.pool1.query(
      'INSERT INTO "Message" ("matchId", "senderId", content) VALUES ($1, $2, $3) RETURNING *',
      [matchId, senderId, content],
    );
    return result.rows[0];
  }

  async getMessagesForMatch(matchId: number) {
    const result = await this.pool1.query(
      'SELECT m.id, m.content, m."createdAt", u.name as senderName FROM "Message" m JOIN "User" u ON m."senderId" = u.id WHERE m."matchId" = $1 ORDER BY m."createdAt"',
      [matchId],
    );
    return result.rows;
  }
}
