import mongoose from "mongoose";
const potdSchema = new mongoose.Schema({
       date: {
           type: String,
           required: true
       },
    //    problem: {
    //        type: mongoose.Schema.Types.ObjectId,
    //        ref: "DsaProblem",
    //        required: true
    //    }
});
const Potd = mongoose.model("Potd", potdSchema);


const potdMonthSchema = new mongoose.Schema([{
         year: {
            type: String,
            required: true
        },

        allMonths:[{
     year_month:
        {
            type: String,
            required: true
        },
    potd_day:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Potd",
    }]
}
]

}]);
const PotdMonth = mongoose.model("PotdMonth", potdMonthSchema);

export { Potd, PotdMonth };

