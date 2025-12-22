import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

// واجهة بيانات المستخدم - User attributes interface
export interface UserAttributes {
  user_id: number;
  username: string;
  password_hash: string;
  role: 'admin' | 'academic' | 'accounting' | 'teacher' | 'student' | 'archivist';
  email?: string;
  is_active: boolean;
  last_login?: Date;
  created_at?: Date;
  updated_at?: Date;
}

// واجهة إنشاء المستخدم - User creation attributes
interface UserCreationAttributes extends Optional<UserAttributes, 'user_id' | 'is_active' | 'last_login' | 'created_at' | 'updated_at'> {}

// نموذج المستخدم - User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public username!: string;
  public password_hash!: string;
  public role!: 'admin' | 'academic' | 'accounting' | 'teacher' | 'student' | 'archivist';
  public email!: string;
  public is_active!: boolean;
  public last_login!: Date;
  
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

// تعريف النموذج - Model definition
User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 50],
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['admin', 'academic', 'accounting', 'teacher', 'student', 'archivist']],
      },
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_login: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default User;
