const express = require('express');
const router = express.Router();
// const db = require('../db');

router.get('/status/:stationId', async (req, res) => {
  const { stationId } = req.params;

//   try {
//     const result = await db.query(
//       'SELECT end_time FROM unlocks WHERE station_id = $1 ORDER BY end_time DESC LIMIT 1',
//       [stationId]
//     );
//     if (result.rows.length > 0) {
//       const { end_time } = result.rows[0];
//       const now = new Date();
//       const isUnlocked = now < new Date(end_time);
//       res.status(200).send({ isUnlocked, endTime: end_time });
//     } else {
//       res.status(200).send({ isUnlocked: false });
//     }
//   } catch (error) {
//     console.error('Database error:', error);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }

    res.status(200).send({ isUnlocked: false });
});

module.exports = router;
