// Promise helpers keep seeding and request ordering deterministic.
exports.run = (db, sql, values = []) => new Promise((resolve, reject) => {
  db.run(sql, values, function (err) { err ? reject(err) : resolve({ id: this.lastID, changes: this.changes }); });
});
exports.all = (db, sql, values = []) => new Promise((resolve, reject) => {
  db.all(sql, values, (err, rows) => err ? reject(err) : resolve(rows));
});
exports.get = (db, sql, values = []) => new Promise((resolve, reject) => {
  db.get(sql, values, (err, row) => err ? reject(err) : resolve(row));
});
