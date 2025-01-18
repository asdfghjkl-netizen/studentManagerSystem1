const redisClient = require('../config/redisConfig');

/**
 * Redis 操作类
 * @date 2025-01-11
 * @description Redis 操作类，用于设置和获取缓存数据。
 */
class RedisOpt {
	/**
	 * 设置缓存的值(String类型)
	 * @param key        键
	 * @param value      值
	 * @param expire     过期时间（秒）
	 */
	async set(key, value, expire) {
		// console.log('set', key, value, expire);
		try {
			// 检查 key 和 value 是否有效
			if (key == null || value == null) {
				throw new Error('Key and value must not be null or undefined');
			}

			// 序列化对象类型的值
			if (typeof value === 'object' && value !== null) {
				value = JSON.stringify(value);
			}

			// 检查过期时间是否有效
			if (expire != null || expire != undefined) {
				if (typeof expire !== 'number' || expire <= 0) {
					throw new Error('Expire must be a positive number');
				}
				redisClient.set(key, value, 'EX', expire);
			} else {
				redisClient.set(key, value);
			}
		} catch (error) {
			// 处理异常
			console.error('Failed to set cache:', error);
			throw error; // 根据需求可以选择重新抛出异常
		}
	}

	/**
	 * 获取缓存的值(String类型)
	 * @param key   键
	 * @returns     缓存值
	 */
	async get(key) {
		return new Promise((resolve, reject) => {
			redisClient.get(key, (err, data) => {
				if (err) {
					console.error(`Failed to get ${key} cache:`, err);
					return reject(err);
				}
				try {
					// 检查 data 是否为 null 或 undefined
					if (data == null) {
						return resolve(null);
					}
					const getData = JSON.parse(data);
					// console.log('data', getData);
					resolve(getData);
				} catch (error) {
					console.error('Failed to parse cache data:', error);
					reject(error);
				}
			});
		});
	}

	/**
	 * 设置缓存的值(Hash类型)
	 * @param key        键
	 * @param field      字段
	 * @param value      值
	 * @param expire     过期时间（秒）
	 */
	async hset(key, field, value, expire) {
		// console.log('hset', key, field, value, expire);
		try {
			// 检查 key 和 value 是否有效
			if (key == null || field == null || value == null) {
				throw new Error('Key, field, and value must not be null or undefined');
			}

			// 序列化对象类型的值
			if (typeof value === 'object' && value !== null) {
				value = JSON.stringify(value);
			}

			// 检查过期时间是否有效
			if (expire != null || expire != undefined) {
				if (typeof expire !== 'number' || expire <= 0) {
					throw new Error('Expire must be a positive number');
				}
				redisClient.hset(key, field, value, 'EX', expire);
			} else {
				redisClient.hset(key, field, value);
			}
		} catch (error) {
			// 处理异常
			console.error('Failed to set cache:', error);
			throw error; // 根据需求可以选择重新抛出异常
		}
	}

	/**
	 * 设置缓存的值(Hash类型)
	 * @param key        键
	 * @param value      值
	 * @param expire     过期时间（秒）
	 */
	async hmset(key, value, expire) {
		try {
			// 检查 key 和 value 是否有效
			if (key == null || value == null) {
				throw new Error('Key and value must not be null or undefined');
			}

			// 序列化对象类型的值
			// if (typeof value === 'object' && value !== null) {
			// 	value = JSON.stringify(value);
			// }

			// 检查过期时间是否有效
			if (expire != null || expire != undefined) {
				if (typeof expire !== 'number' || expire <= 0) {
					throw new Error('Expire must be a positive number');
				}
				redisClient.hmset(key, value, 'EX', expire);
			} else {
				redisClient.hmset(key, value);
			}
		} catch (error) {
			// 处理异常
			console.error('Failed to set cache:', error);
			throw error;
		}
	}

	/**
	 * 获取该键值下所有缓存的值(Hash类型)
	 * @param key   键
	 * @returns     缓存值
	 */
	async hgetall(key) {
		return new Promise((resolve, reject) => {
			redisClient.hgetall(key, (err, data) => {
				if (err) {
					console.error(`Failed to get ${key} cache:`, err);
					return reject(err);
				}
				try {
					// 检查 data 是否为 null 或 undefined
					if (data == null) {
						return resolve(null);
					}
					// const getData = JSON.parse(data);
					// console.log('data', getData);
					resolve(data);
				} catch (error) {
					console.error('Failed to parse cache data:', error);
					return reject(error);
				}
			});
		});
	}

	/**
	 * 添加缓存的值(List类型)
	 * @param key        键
	 * @param value      值
	 * @param expire     过期时间（秒）
	 */
	async lpush(key, value, expire) {
		try {
			// 检查 key 和 value 是否有效
			if (key == null || value == null) {
				throw new Error('Key and value must not be null or undefined');
			}

			// 序列化对象类型的值
			if (typeof value === 'object' && value !== null) {
				value = JSON.stringify(value);
			}

			// 检查过期时间是否有效
			if (expire != null || expire != undefined) {
				if (typeof expire !== 'number' || expire <= 0) {
					throw new Error('Expire must be a positive number');
				}
				redisClient.lpush(key, value, 'EX', expire);
			} else {
				redisClient.lpush(key, value);
			}
		} catch (error) {
			// 处理异常
			console.error('Failed to set cache:', error);
			throw error;
		}
	}
	async rpush(key, value, expire) {
		try {
			// 检查 key 和 value 是否有效
			if (key == null || value == null) {
				throw new Error('Key and value must not be null or undefined');
			}

			// 序列化对象类型的值
			if (typeof value === 'object' && value !== null) {
				value = JSON.stringify(value);
			}

			// 检查过期时间是否有效
			if (expire != null || expire != undefined) {
				if (typeof expire !== 'number' || expire <= 0) {
					throw new Error('Expire must be a positive number');
				}
				redisClient.rpush(key, value, 'EX', expire);
			} else {
				redisClient.rpush(key, value);
			}
		} catch (error) {
			// 处理异常
			console.error('Failed to set cache:', error);
			throw error;
		}
	}

	/**
	 * 获取缓存的值(List类型)
	 * @param key        键    
	 * @param start      开始索引    0表示获取第一个元素
	 * @param stop       结束索引    -1表示获取所有 0表示获取第一个元素
	 * @returns          缓存值
	 */
	async lrange(key, start = 0, stop = -1) {
		return new Promise((resolve, reject) => {
			redisClient.lrange(key, start, stop, (err, data) => {
				if (err) {
					console.error(`Failed to get ${key} cache:`, err);
					return reject(err);
				}
				try {
					// 检查 data 是否为 null 或 undefined
					if (data == null) {
						return resolve(null);
					}
					// const getData = JSON.parse(data);
					// console.log('data', getData);
					resolve(data);
				} catch (error) {
					console.error('Failed to parse cache data:', error);
					return {
						code: 500,
						msg: 'Failed to parse cache data:',
					}
				}
			})
		})
	}

	/**
	 * 删除缓存的值(List类型)
	 * @param key        键
	 * @param start      开始索引
	 * @param stop       结束索引
	 */
	async lremove(key, start, stop) {
		try {
			// 检查 key 和 value 是否有效
			if (key == null || start == null || stop == null) {
				throw new Error('Key and value must not be null or undefined');
			}
			redisClient.lrem(key, start, stop, (err, data) => {
				if (err) {
					console.error(`Failed to get ${key} cache:`, err);
					return err;
				}
				try {
					return true;
				} catch (error) {
					console.error('Failed to parse cache data:', error);
					return {
						code: 500,
						msg: 'Failed to parse cache data:',
					}
				}
			});
		} catch (error) {
			// 处理异常
			console.error('Failed to set cache:', error);
			throw error;
		}
	}

	/**
	 * 删除缓存的键
	 * @param key   键
	 */
	async del(key) {
		try {
			if (key == null) {
				throw new Error('Key must not be null or undefined');
			}
			redisClient.del(key);
		} catch (error) {
			console.error('Failed to delete cache:', error);
			throw error;
		}
	}

	/**
	 * 检查缓存是否存在
	 * @param key   键
	 */
	async exists(key) {
		try {
			if (key == null) {
				throw new Error('Key must not be null or undefined');
			}
			redisClient.exists(key);
		} catch (error) {
			console.error('Failed to check cache existence:', error);
			throw error;
		}
	}
}

module.exports = {
	RedisOpt,
}
