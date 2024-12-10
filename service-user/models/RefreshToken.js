module.exports = (sequelize, Datatypes) => {
    const RefreshToken = sequelize.define('RefreshToken' /*nama model*/, {
        id: {
            type: Datatypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        token: {
            type: Datatypes.TEXT,
            allowNull: false
        },
        user_id: {
            type: Datatypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: Datatypes.DATE,
            allowNull: false,
            field: 'created_at'
        },
        updatedAt: {
            type: Datatypes.DATE,
            allowNull: false,
            field: 'updated_at'
        }
    }, {
        tableName: 'refresh_tokens',
        timestamps: true,
    });

    return RefreshToken;
}