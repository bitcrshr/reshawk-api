import * as admin from 'firebase-admin';
import MongoClient, { ObjectID } from 'mongodb';

export enum DBManagerError {
  USER_DOES_NOT_EXIST = "USER_DOES_NOT_EXIST",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  USER_REF_FIELD_NOT_PRESENT = "USER_REF_FIELD_NOT_PRESENT",
  USER_REF_DOCUMENT_DOES_NOT_EXIST = "USER_REF_DOCUMENT_DOES_NOT_EXIST",
  USER_ILLEGAL_ROLE = "USER_ILLEGAL_ROLE",
  INVITE_CODE_ILLEGAL_ROLE = "INVITE_CODE_ILLEGAL_ROLE",
  INVITE_CODE_DOES_NOT_EXIST = "INVITE_CODE_DOES_NOT_EXIST",
  INVALID_INVITE_CODE = "INVALID_INVITE_CODE",
  INVITE_CODE_MAX_USE_REACHED = "INVITE_CODE_MAX_USE_REACHED",
  MISSING_PARAMETERS = "MISSING_PARAMETERS",
  UNKNOWN = "UNKNOWN",
}

export type User = {
  _id: string;
  uniqueID: string;
  email: string;
  name: string;
  hall: string;
  bio?: string;
  profilePicture?: string;
  roomNumber?: string;
}

export type InviteCode = {
  _id: string;
  owner: string;
  forRole: string;
  hall: string;
  currentUsers: string[];
  maxUsers: number;
}

export default class DBManager {
  private static _instance: DBManager;
  private db: MongoClient.Db | null;  
  private constructor() {
    this.db = null;
  }

  private async init() {
    const client = await MongoClient.connect("mongodb://localhost:27017/reshawk-db");

    this.db = client.db('reshawk-db');
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new DBManager();
    }

    return this._instance;
  }

  public async addUserByUID(opts: {uid: string, user: User}) {
    if (!this.db) await this.init();

    if (await this.db!.collection('users').findOne({_id: opts.uid})) throw DBManagerError.USER_ALREADY_EXISTS;

    return await this.db!.collection('users').insertOne({...opts.user});
  }

  public async getUserByUID(uid: string) {
    if (!this.db) await this.init();

    const user = await this.db!.collection('users').findOne({_id: uid});

    if (!user) {
      throw DBManagerError.USER_DOES_NOT_EXIST;
    }

    return user;
  }

  public async deleteUser(uid: string) {
    if (!this.db) await this.init();

    if (await this.db!.collection('users').findOne({_id: uid})) throw DBManagerError.USER_ALREADY_EXISTS;

    return await this.db!.collection('users').deleteOne({_id: uid});
  }

  public async updateUser(opts: {uid: string, user: User}) {
    if (!this.db) await this.init();

    if (!(await this.db!.collection('users').findOne({_id: opts.uid}))) throw DBManagerError.USER_DOES_NOT_EXIST;

    return await this.db!.collection('users').updateOne({_id: opts.uid}, opts.user);
  }

  public async getAllUsers() {
    if (!this.db) await this.init();

    return await this.db!.collection('users').find().toArray();
  }

  public async createInviteCode(opts: {forHall: string, owner: string, forRole: string, maxUsers: number }) {
    if (!this.db) await this.init();

    const roles = ['RA', 'RD', 'RESIDENT'];

    if (!roles.includes(opts.forRole)) throw DBManagerError.INVITE_CODE_ILLEGAL_ROLE

    if (!(await this.db!.collection('users').findOne({_id: opts.owner}))) throw DBManagerError.USER_DOES_NOT_EXIST;

    return await this.db!.collection('invite-codes').insertOne({
      forHall: opts.forHall,
      forRole: opts.forRole,
      owner: opts.owner,
      currentUsers: [],
      maxUsers: opts.maxUsers
    })
  }

  public async getInviteCode(code: string) {
    if (!this.db) await this.init();

    const inviteCode = await this.db!.collection('invite-codes').findOne({_id: code});

    if (!inviteCode) throw DBManagerError.INVALID_INVITE_CODE;

    return inviteCode;
  }

  public async deleteInviteCode(code: string) {
    if (!this.db) await this.init();

    const result = await this.db!.collection('invite-codes').findOneAndDelete({_id: code});

    if (!result.ok) throw DBManagerError.INVITE_CODE_DOES_NOT_EXIST
  }
  
}