import express from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import data from '../data/data.json';

// Set up express
const app = express();
app.use(express.json());
app.use(express.urlencoded());

const epPort = 5000;
const dbURI = 'mongodb://localhost:27017/';
const dbClient = new MongoClient(dbURI, { useUnifiedTopology: true });

async function useDB() {
  if (!dbClient.isConnected()) {
    await dbClient.connect();
  }
  return dbClient.db('carshop');
}

function loadInitDB() {
  useDB()
    .then(async db => {
      await db.dropCollection('employees');
      await db.dropCollection('carmodels');
      await db.dropCollection('sales');

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
    console.log(req.body);

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
      .then(db =>
        db
          .collection('sales')
          .aggregate([
            {
              $lookup: {
                localField: 'employee_id',
                from: 'employees',
                foreignField: 'id',
                as: 'employee',
              },
            },
            {
              $unwind: '$employee',
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
              $unwind: '$carmodel',
            },
            {
              $group: {
                _id: '$employee_id',
                name: { $first: '$employee.name' },
                sales: { $sum: '$carmodel.price' },
              },
            },
          ])
          .toArray()
      )
      .then(result => res.send(result))
      .catch(err => console.log(err));
  });
}

main().catch(console.error);

app.listen(epPort, () => {
  console.log(`Example app listening at http://localhost:${epPort}`);
});
