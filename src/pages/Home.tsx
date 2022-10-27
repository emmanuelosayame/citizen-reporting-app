import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { personCircle } from "ionicons/icons";
import "./Home.css";
// import {} from 'react-firebase-hooks/auth'
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { collection, CollectionReference } from "firebase/firestore";
import { Virtuoso } from "react-virtuoso";
import { dateTimeLocale, limitText } from "../components/Hooks";
import { Incident } from "../components/Types";
import { useState } from "react";
import placeholderImg from "../imgplaceholder.jpg";

const Home = ({ openLogin }: { openLogin: () => void }) => {
  const [data] = useCollectionData<Incident>(
    collection(db, "incidents") as CollectionReference<Incident>
  );

  const user = auth.currentUser;

  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);

  // const pushData = () => {
  //   const max = data?.length + 20;
  //   const min = max - 20;
  //   const newData = [];
  //   for (let i = min; i < max; i++) {
  //     newData.push("Item" + i);
  //   }

  //   // setData([...data, ...newData]);
  // };
  // const loadData = (ev: any) => {
  //   setTimeout(() => {
  //     pushData();
  //     console.log("Loaded data");
  //     ev.target.complete();
  //     if (data?.length === 1000) {
  //       setInfiniteDisabled(true);
  //     }
  //   }, 500);
  // };

  // useIonViewWillEnter(() => {
  //   pushData();
  // });

  // console.log(data);

  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar>
          <IonButtons slot='secondary'>
            {!user ? (
              <IonButton size='large' onClick={openLogin}>
                <IonIcon slot='icon-only' icon={personCircle}></IonIcon>
              </IonButton>
            ) : (
              <IonAvatar
                slot='secondary'
                style={{ width: "50px", height: "50px", marginRight: "1rem" }}>
                <img
                  alt="Silhouette of a person's head"
                  src={
                    user.photoURL ||
                    "https://ionicframework.com/docs/img/demos/avatar.svg"
                  }
                />
              </IonAvatar>
            )}
          </IonButtons>
          <IonTitle color='primary'>
            <h1 className='header'>Citizens Plus</h1>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonText color='medium'>
          <p style={{ padding: "0 20px", fontSize: "17px" }}>
            Latest Incidents
          </p>
        </IonText>
        <IonRefresher
          slot='fixed'
          pullFactor={0.5}
          pullMin={100}
          pullMax={200}
          onIonRefresh={() => {}}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonList>
          {data?.map((item, index) => {
            return (
              <div key={index}>
                <IonCard className='rounded-lg'>
                  <IonImg src={item?.imageURL || placeholderImg} />
                  <IonCardHeader>
                    <IonCardTitle>{item?.title}</IonCardTitle>
                    {item.timePosted && (
                      <IonCardSubtitle>
                        {dateTimeLocale(item?.timePosted.toDate())}
                      </IonCardSubtitle>
                    )}
                  </IonCardHeader>

                  {item.body && (
                    <IonCardContent>
                      {limitText(item?.body, 100)}
                    </IonCardContent>
                  )}
                </IonCard>
              </div>
            );
          })}
        </IonList>
        <IonInfiniteScroll
          onIonInfinite={() => console.log("first")}
          threshold='100px'
          disabled={isInfiniteDisabled}>
          <IonInfiniteScrollContent
            loadingSpinner='bubbles'
            loadingText='Loading more data...'></IonInfiniteScrollContent>
        </IonInfiniteScroll>
        {/* <Virtuoso
          data={data || []}
          style={{ height: "100%" }}
          totalCount={100}
          className='ion-content-scroll-host'
          headerFooterTag=''
          itemContent={(index, data) => {
            return (
              <div key={index}>
                <IonCard className='rounded-lg'>
                  <IonImg src={data?.imageURL} />
                  <IonCardHeader>
                    <IonCardTitle>{data?.title}</IonCardTitle>
                    {data.timePosted && (
                      <IonCardSubtitle>
                        {dateTimeLocale(data?.timePosted.toDate())}
                      </IonCardSubtitle>
                    )}
                  </IonCardHeader>

                  {data.body && (
                    <IonCardContent>
                      {limitText(data?.body, 100)}
                    </IonCardContent>
                  )}
                </IonCard>
              </div>
            );
          }}></Virtuoso> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
