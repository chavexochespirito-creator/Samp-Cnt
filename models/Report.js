const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    guildId: String,
    threadId: String,
    reporterId: String,
    accused: String,
    status: { type: String, default: 'Em Análise' },
    reason: String
});

module.exports = mongoose.model('Report', ReportSchema);
