//import
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//routes
//create an item
// app.post("/api/weightcalcu", async (req, res) => {
//     try {
//         const { item_name, item_variation, item_weight } = req.body;

//         //check if exist before insert
//         if(!item_name.trim() && !item_variation.trim() && !item_weight.trim()){
//             return res.json("some of the inputs are missing or it only contains whitespaces");
//         }
//         if(isNaN(item_weight)){
//             return res.json("weight is not a numerical");
//         }

//         const item_weight_num = parseFloat(item_weight);

//         const checkItem = await pool.query("SELECT * FROM all_items WHERE UPPER(item_name) = UPPER($1) AND UPPER(item_variation) = UPPER($2)", [item_name, item_variation]);

//         if(checkItem.rowCount > 0){
//             return res.json("Item already exist");
//         }

//         const newItem = await pool.query("INSERT INTO all_items (item_name, item_variation, item_weight) VALUES(UPPER($1), UPPER($2), ($3))", [item_name, item_variation, item_weight_num]);
//         return res.json("Added new Item");
//     } catch (err) {
//         console.error(err.message);
//     }
// });

app.put("/api/weightcalcu/:item_id", async (req, res) => {
    try {
        //init properties
        const { item_id } = req.params;
        const { item_name, item_variation, item_weight } = req.body;

        //check property
        if(!item_name.trim() && !item_variation.trim() && !item_weight.trim())
            return res.json("one of the property is null, empty or it only contains whitespaces");

        if(isNaN(item_weight))
            return res.json("weight is not a number");

        const checkItem = await pool.query("SELECT * FROM all_items WHERE item_id = $1", [item_id]);
        // return res.json("item row count : " + checkItem.rowCount);

        if(checkItem.rowCount < 1)
            return res.json("No data is existing");

        const updateItem = await pool.query("UPDATE all_items SET item_name = $1, item_variation = $2, item_weight = $3 WHERE item_id = $4", [item_name, item_variation, item_weight, item_id]);
        return res.json("Item has been updated");
    } catch (err) {
        console.error(err.message);
    }

});

app.get("/api/weightcalcu", async (req, res) => {
    try {
        // Use DISTINCT so the first dropdown only shows each name once
        const listItem = await pool.query("SELECT DISTINCT item_name FROM all_items");
        res.json(listItem.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/api/weightcalcu/:id", async (req, res) => {
    try {
        //init
        const { id } = req.params;
        const listItem = await pool.query("SELECT * FROM all_items WHERE item_id = $1",[id]);
        res.json(listItem.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/api/items", async (req, res) => {
    try {
        const items = await pool.query(
            "SELECT * FROM all_items ORDER BY item_name, item_variation"
        );
        res.json(items.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// app.delete("/api/weightcalcu/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deleteItem = await pool.query("DELETE FROM all_items WHERE item_id = $1", [id]);
//         res.json("item has been deleted.");
//     } catch (err) {
//         console.error(err.message);
//     }
// });

// Get variations based on Item Name
app.get("/api/items/:itemName", async (req, res) => {
    try {
        const { itemName } = req.params;
        // We use UPPER to match your INSERT logic
        const variants = await pool.query(
            "SELECT * FROM all_items WHERE UPPER(item_name) = UPPER($1)", 
            [itemName]
        );
        res.json(variants.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//check database
app.get("/debug-db-info", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        current_database() AS db,
        current_user AS user,
        inet_server_addr() AS server,
        inet_server_port() AS port
    `);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/debug-db-info", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        current_database() AS db,
        current_user AS user,
        inet_server_addr() AS server,
        inet_server_port() AS port
    `);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// app.listen(5000, () => {
//     console.log("server has started on port 5000");
// });

module.exports = app;
