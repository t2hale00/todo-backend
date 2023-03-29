import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { Pool } from 'pg'
import { QueryResult } from 'pg'

const app: Express = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const port = 3001

app.delete("/delete/:id",async(req: Request,res: Response) => {
    const pool = openDb()

    const id = parseInt(req.params.id)

    pool.query('delete from task where id = $1',
    [id],
    (error: Error,result: QueryResult) => {
        if(error) {
            res.status(500).json({error: error.message})
        }

        res.status(200).json({id: id})
    })
})


app.post('/new',(req: Request, res: Response) => {
    const pool = openDb()

    pool.query('insert into task (description) values ($1) returning *',
    [req.body.description],
    (error: Error,result: QueryResult) => {
        if (error) {
            res.status(500).json({error: error.message})
        }
        res.status(200).json({id: result.rows[0].id})
    })
})

app.get('/', (req: Request, res: Response) => {
    const pool = openDb()

    pool.query('select * from task', (error, result) => {
        if (error) {
            res.status(500).json({error: error.message})
        }res.status(200).json(result.rows)
    })
})

const openDb = (): Pool => {
    const pool: Pool = new Pool ({
       /* user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: '1805',
        port: 5432*/
        user: 'root',
        host: 'dpg-cgi4br8rjenrd3n0l8pg-a.oregon-postgres.render.com',
        database: 'todo_02mn',
        password: 'LiuXq7MCUwT6T2pEs9KgKRwnmOYgjgy0',
        port: 5432
        ssl: true
    })  
    return pool
}

app.listen(port)