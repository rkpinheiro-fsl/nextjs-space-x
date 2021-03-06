import Head from "next/head";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import styles from "../styles/Home.module.css";

export default function Home({ launches }) {
  const [session, loading] = useSession();
  return (
    <div className={styles.container}>
      <Head>
        <title>SpaceX Launches</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SpaceX Launches</h1>

        <p className={styles.description}>Latest launches from SpaceX</p>

        {!session && (
          <>
            Not signed in <br />
            <button onClick={signIn}>Sign In</button>
          </>
        )}

        {session && (
          <>
            Signed in as {session.user.name}
            <br />
            <button onClick={signOut}>Sign out</button>
            <div className={styles.grid}>
              {launches.map((launch) => (
                <a
                  key={launch.id}
                  href={launch.links.video_link}
                  className={styles.card}
                >
                  <h3>{launch.mission_name}</h3>
                  <p>
                    <strong>Launch Time:</strong>{" "}
                    {new Date(launch.launch_date_local).toLocaleDateString(
                      "en-US"
                    )}
                  </p>
                </a>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://api.spacex.land/graphql/",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query getLaunches {
        launchesPast(limit: 10) {
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
          }
          rocket {
            rocket_name
          }
          ships {
            name
            home_port
            image
          }
        }
      }
    `,
  });
  return {
    props: {
      launches: data.launchesPast,
    },
  };
}
