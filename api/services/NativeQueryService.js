const NativeQueryService = {

  aggregateQuery: function (model, aggregate) {
    return new Promise((resolve, reject) => {
      model.native(function (err, collection) {
        if (err) return reject(err);

        collection.aggregate(aggregate, function (err, result) {
          if (err) return reject(err);

          return resolve(result);
        })
      })
    })
  },

  mapReduceQuery: function (model, map, reduce, output) {
    return new Promise((resolve,reject)=>{
      model.native(function (err,collection) {
        if(err) return reject(err)

        collection.mapReduce(map,reduce,output,function (err,result) {
          if(err) return reject(err)

          return resolve(typeof (result))
        })
      })
    })
  }

}

module.exports = NativeQueryService;
