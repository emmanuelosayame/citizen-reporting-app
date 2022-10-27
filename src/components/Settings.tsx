import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import "../pages/Home.css";
import { LoadingBlur } from "./Loading";

const Settings = ({ onOpenUserModal }: any) => {
  const [user, loading] = useAuthState(auth);
  if (loading) return <LoadingBlur />;

  if (!user)
    return (
      <IonPage>
        <IonContent>
          <IonCard className='rounded-lg ion-padding'>
            <IonCardHeader>
              <IonCardTitle>
                <h2
                  style={{
                    color: "blue",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "25px",
                  }}>
                  Login / Signup to your account
                </h2>
              </IonCardTitle>
              <IonCardSubtitle>
                Discover the latest incidents happening and share with the world
              </IonCardSubtitle>
            </IonCardHeader>
            <IonButton
              expand='block'
              size='large'
              onClick={() => onOpenUserModal()}>
              LOGIN / SIGNUP
            </IonButton>
          </IonCard>
        </IonContent>
      </IonPage>
    );

  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar>
          <IonTitle>
            <h1>Settings</h1>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonToolbar className='ion-padding'>
          <IonText color='primary' className='ion-padding'>
            <h3 style={{ fontSize: "25px" }}>{`Hi, ${
              user.displayName || "there"
            }`}</h3>
          </IonText>
        </IonToolbar>
        <IonButton mode='ios' expand='block' onClick={() => auth.signOut()}>
          LOGOUT
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
