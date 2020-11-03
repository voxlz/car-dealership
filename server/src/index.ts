import express from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import data from '../data/data.json';
import bcrypt from 'bcrypt';

// Set up express
const app = express();
app.use(express.json());
app.use(express.urlencoded());

const epPort = 5000;
const dbURI =
  'mongodb+srv://dbUser:H8gjOc8dgTEHztnY@cluster0.mhvck.mongodb.net/carShop?retryWrites=true&w=majority';
const dbClient = new MongoClient(dbURI, { useUnifiedTopology: true });

export interface IUser {
  _id: string;
  pass: string;
  email: string;
  name: string;
  employeeId?: string;
}

export interface ILogin {
  pass: string;
  email: string;
}

export interface IServerRes {
  success: boolean;
  value: string | IUser;
  emailExisted: boolean | undefined;
}

async function useDB() {
  if (!dbClient.isConnected()) {
    await dbClient.connect();
  }
  return dbClient.db('carShop');
}

function loadInitDB() {
  useDB()
    .then(async db => {
      await db.dropCollection('employees');
      await db.dropCollection('carmodels');
      await db.dropCollection('sales');
      await db.dropCollection('users');

      db.collection('users').createIndex({ email: 1 }, { unique: true });

      db.collection('employees')
        .insertMany(data.carshop.employees)
        .then(() => console.log('import of employees successful'));
      db.collection('carmodels')
        .insertMany(data.carshop.carmodels)
        .then(() => console.log('import of carmodels successful'));
      db.collection('sales')
        .insertMany(data.carshop.sales)
        .then(() => console.log('import of sales successful'));
    })
    .catch(err => console.log(err));
}

//loadInitDB();

async function main() {
  app.get('/employees', (req, res) => {
    useDB()
      .then(db => db.collection('employees').find().toArray())
      .then(employees => res.send(employees))
      .catch(err => console.log(err));
  });

  app.get('/carmodels', (req, res) => {
    useDB()
      .then(db => db.collection('carmodels').find().toArray())
      .then(carmodels => res.send(carmodels))
      .catch(err => console.log(err));
  });

  app.post('/carmodels', (req, res) => {
    useDB()
      .then(db => db.collection('carmodels').insertOne(req.body))
      .then(() => res.send(req.body))
      .catch(err => console.log(err));
  });

  app.delete('/carmodels', (req, res) => {
    useDB()
      .then(db => db.collection('carmodels'))
      .then(col => col.findOneAndDelete({ _id: new ObjectID(req.body._id) }))
      .then(result => res.send(result.value))
      .catch(err => console.log(err));
  });

  app.get('/total_sales', (req, res) => {
    useDB()
      .then(db => db.collection('sales').aggregate(salesReq).toArray())
      .then(result => res.send(result))
      .catch(err => console.log(err));
  });

  app.get('/sales', (req, res) => {
    useDB()
      .then(db => db.collection('sales').aggregate(salesReq2).toArray())
      .then(result => {
        console.log(result);
        res.send(result);
      })
      .catch(err => console.log(err));
  });

  // Expects user in body, with plain text pass field
  app.post('/register', (req, res) => {
    const usr = req.body as IUser;
    bcrypt.hash(usr.pass, 10, function (err, hash) {
      if (err) return console.error(err);
      let employeeId;
      useDB()
        .then(db => {
          db.collection('employees')
            .findOne({ name: usr.name })
            .then(user => {
              if (user) employeeId = user._id;
            })
            .catch();

          const hashUsr = { ...usr, ...{ pass: hash, employeeId: employeeId } };

          db.collection('users')
            .insertOne(hashUsr)
            .then(result => {
              if (result.result.ok === 1) {
                const hashUserWithID = { ...hashUsr, ...{ _id: result.insertedId } };
                const serverRes: IServerRes = {
                  success: true,
                  value: hashUserWithID,
                  emailExisted: false,
                };
                res.send(serverRes);
              }
            })
            .catch(() => {
              const serverRes: IServerRes = {
                success: false,
                value: 'Email already exists',
                emailExisted: true,
              };
              res.send(serverRes);
            });
        })
        .catch(err => console.log(err));
    });
  });

  // Expects pass and email in body
  app.post('/login', (req, res) => {
    useDB()
      .then(db =>
        db.collection('users').findOne<IUser>({ email: req.body.email })
      )
      .then(user => {
        if (user)
          bcrypt.compare(req.body.pass, user.pass, function (err, isSame) {
            if (err) return console.error(err);
            const serverRes: IServerRes = {
              success: isSame,
              value: isSame ? user : 'Password was incorrect',
              emailExisted: true,
            };
            res.send(serverRes);
          });
        else {
          const serverRes: IServerRes = {
            success: false,
            value: 'User with this email does not exist',
            emailExisted: false,
          };
          res.send(serverRes);
        }
      })
      .catch(err => console.log(err));
  });
}

main().catch(console.error);

app.listen(epPort, () => {
  console.log(`Example app listening at http://localhost:${epPort}`);
});

const salesReq = [
  {
    $lookup: {
      localField: 'employee_id',
      from: 'employees',
      foreignField: 'id',
      as: 'employee',
    },
  },
  {
    $unwind: { path: '$employee', preserveNullAndEmptyArrays: true },
  },
  {
    $lookup: {
      localField: 'carmodel_id',
      from: 'carmodels',
      foreignField: 'id',
      as: 'carmodel',
    },
  },
  {
    $unwind: { path: '$carmodel', preserveNullAndEmptyArrays: true },
  },
  {
    $group: {
      _id: '$employee_id',
      name: { $first: '$employee.name' },
      sales: { $sum: '$carmodel.price' },
    },
  },
];

const salesReq2 = [
  {
    $lookup: {
      localField: 'employee_id',
      from: 'employees',
      foreignField: 'id',
      as: 'employee',
    },
  },
  {
    $unwind: { path: '$employee', preserveNullAndEmptyArrays: true },
  },
  {
    $lookup: {
      localField: 'carmodel_id',
      from: 'carmodels',
      foreignField: 'id',
      as: 'carmodel',
    },
  },
  {
    $unwind: { path: '$carmodel', preserveNullAndEmptyArrays: true },
  },
];
