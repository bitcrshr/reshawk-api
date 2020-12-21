import express from "express";
import DBManager, { DBManagerError } from "../db-manager";
import {ensureClientAuthenticated, ensureClientAuthorized } from "../api-auth/api-auth"

export default function routesConfig(app: express.Application) {
    /*
        This is where you want to put all of the routes. Here is an example:

        app.get('/api/users/:id', [
            ensureClientAuthenticated, // make sure the client is logged in with firebase
            ensureClientAuthorized({ allowedRoles: ['RA', 'RD']}), // make sure the client has permission to do what they are trying to
            async function (req: express.Request, res: express.Response, next: express.NextFunction) {
                const id = req.params.id;

                try {
                    const user = await DBManager.instance().getUserByUID(id);

                    return res.status(200).json(user);
                } catch (e) {
                    if (e === DBManagerError.USER_DOES_NOT_EXIST) {
                        return res.status(404).json({ error: e });
                    }

                    // we don't know what happened.
                    console.log(e);
                    return res.status(500).json({ error: DBManagerError.UNKNOWN });
                }
            }
        ]);

        NOTE: You can exclude ensureClientAuthenticated and ensureClientAuthorized while testing to make things easier--that way you don't 
        have to have a frontend to interact with the API.

        Also, you should make sure to always return something in each one of your routes. 


    */

    // delete this
    app.get('/', function(req: express.Request, res: express.Response, next: express.NextFunction) {
        return res.status(200).send("it works!")
    })
}
