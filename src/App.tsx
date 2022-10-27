import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonModal,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  add,
  bookmark,
  calendar,
  ellipse,
  home,
  newspaper,
  settings,
  square,
  triangle,
} from "ionicons/icons";
import Home from "./pages/Home";
import Created from "./pages/Created";
import Saved from "./pages/Saved";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { settings as settingsCluster } from "cluster";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import UserModal from "./components/UserModal";
import { useDisclosure } from "@chakra-ui/hooks";
import AddIncident from "./pages/AddIncident";
import Settings from "./components/Settings";

setupIonicReact();

const App: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  // console.log(user);

  const {
    isOpen: isOpenLogin,
    onClose: onCloseLogin,
    onOpen: onOpenUserModal,
  } = useDisclosure();

  const {
    isOpen: isOpenNew,
    onClose: onCloseNew,
    onOpen: onOpenNew,
  } = useDisclosure();

  return (
    <IonApp>
      <IonModal isOpen={isOpenLogin}>
        <UserModal onCloseLogin={onCloseLogin} />
      </IonModal>
      <IonModal isOpen={isOpenNew}>
        {user ? (
          <AddIncident onCloseNew={onCloseNew} user={user} />
        ) : (
          <UserModal onCloseLogin={onCloseNew} />
        )}
      </IonModal>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path='/home'>
              <Home openLogin={onOpenUserModal} />
            </Route>
            <Route exact path='/created'>
              <Created />
            </Route>
            <Route exact path='/saved'>
              <Saved />
            </Route>
            <Route exact path='/settings'>
              <Settings onOpenUserModal={onOpenUserModal} />
            </Route>
            <Route exact path='/'>
              <Redirect to='/home' />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot='bottom'>
            <IonTabButton tab='home' href='/home'>
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab='created' href='/created'>
              <IonIcon icon={newspaper} />
              <IonLabel>My Posts</IonLabel>
            </IonTabButton>
            <IonTabButton>
              <IonIcon />
              <IonLabel></IonLabel>
            </IonTabButton>
            <IonTabButton tab='saved' href='/saved'>
              <IonIcon icon={bookmark} />
              <IonLabel>Saved</IonLabel>
            </IonTabButton>
            <IonTabButton tab='settings' href='/settings'>
              <IonIcon icon={settings} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
        <IonFab vertical='bottom' horizontal='center' slot='fixed'>
          <IonFabButton onClick={onOpenNew}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
