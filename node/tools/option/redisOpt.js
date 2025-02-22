const redisClient = require('../../config/redisConfig');

class RedisOpt {
  constructor() {
    // 确保方法正确绑定到实例
    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
    this.hmset = this.hmset.bind(this);
    this.hset = this.hset.bind(this);
    this.hgetall = this.hgetall.bind(this);
    this.lpush = this.lpush.bind(this);
    this.rpush = this.rpush.bind(this);
    this.lrange = this.lrange.bind(this);
    this.lremove = this.lremove.bind(this);
    this.exists = this.exists.bind(this);
    this.del = this.del.bind(this);
  }

  /**
   * 通用的错误处理方法
   * @param {string} operation  操作名称
   * @param {Error}  error      错误对象
   */
  _handleError(operation, error) {
    if (operation != null) {
      console.error(`Redis ${operation} failed:`, error);
    } else {
      console.error(`Redis operation failed:`, error);
    }
    throw error;
  }

  /**
   * 检查参数是否有效
   * @param {Array} params 参数数组
   * @returns {boolean}    是否有效
   */
  _validateParams(params) {
    return params.every(param => param != null);
  }

  /**
   * 序列化值
   * @param {any} value 需要序列化的值
   * @returns {string}  序列化后的值
   */
  _serialize(value) {
    return typeof value === 'object' ? JSON.stringify(value) : value;
  }

  /**
   * 反序列化值
   * @param {string} data  需要反序列化的值
   * @returns {any}        反序列化后的值
   */
  _deserialize(data) {
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  /**
   * String 操作
   * @param {string}  key 键
   * @param {any} 	value 值
   * @param {number}  expire 过期时间
   * @returns {Promise<boolean>} 是否成功
   */
  async set(key, value, expire = null) {
    try {
      if (!this._validateParams([key, value])) {
        throw new Error('Invalid parameters');
      }
      const serializedValue = this._serialize(value);
      if (expire) {
        return redisClient.set(key, serializedValue, 'EX', expire);
      } else {
        return redisClient.set(key, serializedValue);
      }
    } catch (error) {
      this._handleError('SET', error);
    }
  }

  /**
   * 获取字符串值
   * @param {string}  key    键
   * @returns {Promise<any>} 值
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      try {
        if (!this._validateParams([key])) {
          throw new Error('Invalid parameters');
        }
        redisClient.get(key, (err, data) => {
          if (data == null) resolve(null);
          if (err) reject(err);
          resolve(this._deserialize(data));
        });
      } catch (error) {
        this._handleError('GET', error);
      }
    });
  }

  /**
   * Hash 操作
   * @param {string} hashKey 哈希表键
   * @param {string} field   字段
   * @param {any}    value   值
   * @returns {Promise<boolean>} 是否成功
   */
  async hset(hashKey, field, value) {
    try {
      if (!this._validateParams([hashKey, field, value])) {
        throw new Error('Invalid parameters');
      }
      const serializedValue = this._serialize(value);
      return redisClient.hset(hashKey, field, serializedValue);;
    } catch (error) {
      this._handleError('HSET', error);
    }
  }

  /**
   * Hash 操作
   * @param {string} hashKey 哈希表键
   * @param {object} fields  字段
   * @returns {Promise<boolean>} 是否成功
   */
  async hmset(hashKey, fields) {
    try {
      if (!this._validateParams([hashKey, fields])) {
        throw new Error('Invalid parameters');
      }
      return redisClient.hmset(hashKey, fields);
    } catch (error) {
      this._handleError('HMSET', error);
    }
  }

  /**
   * 获取哈希表值
   * @param {string} hashKey 哈希表键
   * @param {string} field 字段
   * @returns {Promise<any>} 值
   */
  // async hget(hashKey, field) {
  // 	try {
  // 		if (!this._validateParams([hashKey, field])) {
  // 			throw new Error('Invalid parameters');
  // 		}
  // 		const data = await redisClient.hget(hashKey, field);
  // 		return this._deserialize(data);
  // 	} catch (error) {
  // 		this._handleError('HGET', error);
  // 	}
  // }

  /**
   * 获取哈希表所有值
   * @param {string} hashKey 哈希表键
   * @returns {Promise<any>} 值
   */
  async hgetall(hashKey) {
    return new Promise((resolve, reject) => {
      try {
        if (!this._validateParams([hashKey])) {
          throw new Error('Invalid parameters');
        }
        redisClient.hgetall(hashKey, (err, data) => {
          if (data == null) resolve(null);
          if (err) reject(err);
          resolve(data);
          // return Object.keys(data || {}).reduce((acc, key) => {
          //   acc[key] = this._deserialize(data[key]);
          //   return acc;
          // }, {});
        });
      } catch (error) {
        this._handleError('HGETALL', error);
      }
    });
  }

  /**
   * List 操作
   * @param {string} key    键
   * @param {...any} values 值
   * @returns {Promise<number>} 返回值
   */
  async lpush(key, ...values) {
    try {
      if (!this._validateParams([key, ...values])) {
        throw new Error('Invalid parameters');
      }
      const serializedValues = values.map(v => this._serialize(v));
      return redisClient.lpush(key, ...serializedValues);
    } catch (error) {
      this._handleError('LPUSH', error);
    }
  }

  /**
   * 右插入列表
   * @param {string} key 键
   * @param {...any} values 值
   * @returns {Promise<number>} 返回值
   */
  async rpush(key, ...values) {
    try {
      if (!this._validateParams([key, ...values])) {
        throw new Error('Invalid parameters');
      }
      const serializedValues = values.map(v => this._serialize(v));
      return redisClient.rpush(key, ...serializedValues);
    } catch (error) {
      this._handleError('RPUSH', error);
    }
  }

  /**
   * 获取列表值
   * @param {string} key    键
   * @param {number} start  开始索引
   * @param {number} stop   结束索引
   * @returns {Promise<any[]>} 返回值
   */
  async lrange(key, start = 0, stop = -1) {
    return new Promise((resolve, reject) => {
      try {
        if (!this._validateParams([key])) {
          throw new Error('Invalid parameters');
        }
        redisClient.lrange(key, start, stop, (err, data) => {
          if (data == null) resolve(null);
          if (err) reject(err);
          resolve(data);
          // resolve(data.map(item => this._deserialize(item)));
        });
      } catch (error) {
        this._handleError('LRANGE', error);
      }
    });
  }

  /**
   * 移除列表中的值
   * @param {string}    key     键
   * @param {number}    count   移除数量
   * @param {any}       value   值
   * @returns {Promise<number>} 返回值
   */
  async lremove(key, count, value) {
    return new Promise((resolve, reject) => {
      try {
        if (!this._validateParams([key, count, value])) {
          throw new Error('Invalid parameters');
        }
        redisClient.lrem(key, count, value, (err, data) => {
          if (err) reject(err);
          try {
            resolve(true);
          } catch (error) {
            return {
              code: 500,
              message: this._handleError('parse cache', error),
            };
          }
        });
      } catch (error) {
        this._handleError('LREMOVE', error);
      }
    });
  }

  /**
   * Set 操作
   * @param {string} key 键
   * @param {...any} members 值
   * @returns {Promise<number>} 返回值
   */
  // async sadd(key, ...members) {
  // 	try {
  // 		if (!this._validateParams([key, ...members])) {
  // 			throw new Error('Invalid parameters');
  // 		}
  // 		const serializedMembers = members.map(m => this._serialize(m));
  // 		return await redisClient.sadd(key, ...serializedMembers);
  // 	} catch (error) {
  // 		this._handleError('SADD', error);
  // 	}
  // }

  /**
   * 获取集合值
   * @param {string} key 键
   * @returns {Promise<any[]>} 返回值
   */
  // async smembers(key) {
  // 	try {
  // 		if (!this._validateParams([key])) {
  // 			throw new Error('Invalid parameters');
  // 		}
  // 		const data = await redisClient.smembers(key);
  // 		return data.map(item => this._deserialize(item));
  // 	} catch (error) {
  // 		this._handleError('SMEMBERS', error);
  // 	}
  // }

  /**
   * 通用操作
   * @param {string} key        键
   * @returns {Promise<number>} 返回值
   */
  async del(key) {
    try {
      if (!this._validateParams([key])) {
        throw new Error('Invalid parameters');
      }
      return redisClient.del(key);
    } catch (error) {
      this._handleError('DEL', error);
    }
  }

  /**
   * 检查键是否存在
   * @param {string} key        键
   * @returns {Promise<number>} 返回值
   */
  async exists(key) {
    try {
      if (!this._validateParams([key])) {
        throw new Error('Invalid parameters');
      }
      return redisClient.exists(key);
    } catch (error) {
      this._handleError('EXISTS', error);
    }
  }

  /**
   * 设置过期时间
   * @param {string} key 键
   * @param {number} seconds 过期时间
   * @returns {Promise<number>} 返回值
   */
  // async expire(key, seconds) {
  // 	try {
  // 		if (!this._validateParams([key, seconds])) {
  // 			throw new Error('Invalid parameters');
  // 		}
  // 		return await redisClient.expire(key, seconds);
  // 	} catch (error) {
  // 		this._handleError('EXPIRE', error);
  // 	}
  // }
}

module.exports = {
  RedisOpt,
};
