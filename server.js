const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors=require('cors')


const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/motorShop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
const MotorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    division: {
        type:String,
    required:true
},
    department:{
        type:String,
    required:true
},
    motorSerialNumber: {
        type:String,
    required:true
},
    phase:{
        type:String,
    required:true
},
    fault:{
        type:String,
    required:true
},
    hp:{
        type:Number,
    required:true
},
    kw:{
        type:Number,
    required:true
},
reg:{
    type:String,
    required:true
}
});

const Motor = mongoose.model('Motor', MotorSchema);

const MotorRewindingSchema = new mongoose.Schema({
    arrivalDate: { type: Date, required: true },
    copperType: { type: String, required: true },
    copperGauge: { type: String, required: true },
    wtOldCopperWire: { type: Number, required: true },
    wtNewCopperWire: { type: Number, required: true },
    items: [{
        itemNo: { type: String },
        itemName: { type: String },
        qty: { type: Number},
        uom: { type: String }
    }]
});

const MotorRewinding = mongoose.model('MotorRewinding', MotorRewindingSchema);



app.post('/api/motor-rewindings', async (req, res) => {
    try {
        const newRewinding = new MotorRewinding(req.body);
        await newRewinding.save();
        res.status(201).json(newRewinding);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/motors', async (req, res) => {
    try {
        const newMotor = new Motor(req.body);
        await newMotor.save();
        res.status(201).json(newMotor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.put('/api/motors/:id', async (req, res) => {
    try {
        const updatedMotor = await Motor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMotor) {
            return res.status(404).json({ message: 'Motor not found' });
        }
        res.json(updatedMotor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/motors/get_all', async (req, res) => {
    try {
        const motors = await Motor.find(); 
        res.status(200).json(motors); 
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
});


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
