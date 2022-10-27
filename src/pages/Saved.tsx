import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { collection, CollectionReference } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ExploreContainer from "../components/ExploreContainer";
import { dateTimeLocale, limitText } from "../components/Hooks";
import { Incident } from "../components/Types";
import { auth, db } from "../firebase";
import "./Saved.css";
import placeholderImg from "../imgplaceholder.jpg";
import { useAuthState } from "react-firebase-hooks/auth";

const Saved: React.FC = () => {
  const [user] = useAuthState(auth);
  const [data] = useCollectionData<Incident>(
    collection(db, "incidents") as CollectionReference<Incident>
  );
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Your saved stories</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {user ? (
          <>
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
              disabled={false}>
              <IonInfiniteScrollContent
                loadingSpinner='bubbles'
                loadingText='Loading more data...'></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </>
        ) : (
          <IonCard>
            <IonCardHeader>login to see saved...</IonCardHeader>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Saved;
