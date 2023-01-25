import { useRouter } from 'next/router';
import ReactPlayer from 'react-player'
import styles from '../styles/player.module.css';
import { useAppSelector } from '../app/hocks'
import { selectItems } from '../features/itemsSlice'

type playerProps = {
  closePlayer: () => void;
  startPlayer: () => void;
};

export default function Player({ closePlayer, startPlayer }: playerProps) {
  const router = useRouter();
  const { startId } = useAppSelector(selectItems);
  const start = (id: number) => {
    console.log(`player:${startId}`)
    fetch(`/api/startRental/${id}`, {
    }).then((response) => response.json()).then((data) => {
      if (data.result) {
        startPlayer()
      } else {
        router.push('/error')
      }
    });
  };
  return (
    <div className={styles.playerArea}>
      <ReactPlayer
        url={'https://www.youtube-nocookie.com/watch?v=Gqoby4CeA3Y'}
        className={styles.reactPlayer}
        width="70%"
        height="70%"
        controls={true}
        playing={true}
        onStart={() => start(startId)}
      />
      <div
        className={styles.closePlayer}
        onClick={() => closePlayer()}
      >
        ×
      </div>
    </div>
  );
}
