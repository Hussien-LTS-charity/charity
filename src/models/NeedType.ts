// TODO: FIX IT TO BE DYNAMIC

// import { DataTypes, Model } from "sequelize";
// import sequelize from "./sequelize";
// import MemberNeeds from "./MemberNeeds";

// interface NeedTypeAttributes {
//   id: number;
//   name: string;
//   priority: number;
// }
// class NeedType extends Model<NeedTypeAttributes> implements NeedTypeAttributes {
//   id!: number;
//   name!: string;
//   priority!: number;
// }

// NeedType.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     priority: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: "NeedType",
//   }
// );

// NeedType.hasMany(MemberNeeds, { foreignKey: "needTypeId" });
// MemberNeeds.belongsTo(NeedType, { foreignKey: "needTypeId" });
// export default NeedType;
