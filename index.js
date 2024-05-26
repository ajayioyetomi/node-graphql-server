import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import db from './_db.js';

const resolvers = {
    Query:{
        games(){
            return db.games
        },
        reviews(){
            return db.reviews
        },
        authors(){
            return db.authors
        },
        review(_,args,context){
            return db.reviews.find((review)=> review.id === args.id)
        },
        game(_,args){
            return db.games.find(game => game.id === args.id);
        },
        author(_,args){
            return db.authors.find(author => author.id === args.id);
        },
    },
    Game:{
        reviews(parent){
            return db.reviews.filter(review => review.game_id === parent.id)
        }
    },
    Author:{
        reviews(parent){
            return db.reviews.filter(review => review.game_id === parent.id)
        }
    },
    Review:{
        author(parent){
            return db.authors.find(author => author.id === parent.author_id)
        },
        game(parent){
            return db.games.find(game => game.id === parent.game_id);
        }
    },
    Mutation:{
        addGame(_,args){
            let game = {
                ...args.game,
                id: Math.floor(Math.random() * 1000).toString()
            }
            db.games.push(game);
            return game;
        },
        deleteGame(_,args){
            db.games = db.games.filter(game => game.id !== args.id)
            return db.games;
        },
        updateGame(_,args){
            db.games = db.games.map((eGame) =>{
                if(eGame.id === args.id){
                    return {...eGame,...args.edits}
                }
                return eGame
            })
            return db.games.find(eGame => eGame.id === args.id);
        }
    }

}

const server = new ApolloServer({
    typeDefs,
    resolvers
});


const {url} = await startStandaloneServer(server,{
    listen:{port:5500}
})

console.log(`Server ready at port`,5500);