import { API, Amplify, graphqlOperation } from 'aws-amplify';
import { useLoaderData, NavLink, Link } from "react-router-dom";
import { listTodos } from "../graphql/queries";
import { useQuery } from "@tanstack/react-query";
import { Flex, Divider } from "@aws-amplify/ui-react";
import awsExports from '../aws-exports';
import '@aws-amplify/ui-react/styles.css';
import Iframe from 'react-iframe'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';


Amplify.configure(awsExports);


export default function Video() {

    //use the loader data in videos/:videoID
    const videos = useLoaderData();


    return (
        <div id="video">
            <div className='my-10 flex flex-row justify-evenly items-center'>
                <div>
                    <span className='text-xl italic font-bold underline underline-offset-2'>
                        {videos.name}
                    </span>

                    <p className='w-96'>
                        {videos.description}
                    </p>
                </div>
                <div>
                    <Iframe url={videos.contentLink}
                        width="640px"
                        height="320px"
                        className=""
                        display="block"
                        position="relative" />
                </div>
            </div>
            <Flex direction="column">
                <Divider
                    orientation="horizontal" />
            </Flex>


            <div class="mt-10 grid grid-cols-4 gap-4">
                <ReccedVideos category={videos.category} />
            </div>





        </div>
    );
};



function ReccedVideos({ category }) {
    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['reccs', category],
        queryFn: async () => {
            const reccData = await API.graphql(
                {
                    query: listTodos,
                    variables: {
                        filter: {
                            category: {
                                eq: category
                            }
                        }
                    }
                }
            )
            const reccos = reccData.data.listTodos.items;
            return reccos;
        },
        enabled: !!category,
    })

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }
    return (
        <>
            {data.map((video) => (
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {video.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {video.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <NavLink to={`/videos/${video.id}`}><Button size="small">PLay Now</Button></NavLink>
                    </CardActions>
                </Card>
            ))}
        </>
    );
}