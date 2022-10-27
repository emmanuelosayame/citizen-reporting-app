import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { arrowBack, camera, cloudUpload } from "ionicons/icons";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { db, storage } from "../firebase";
// import { Camera, CameraResultType } from "@capacitor/camera";
import { useState } from "react";
import placeholderImg from "../imgplaceholder.jpg";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { v4 } from "uuid";

const AddIncident = ({
  onCloseNew,
  user,
}: {
  onCloseNew: () => void;
  user: User;
}) => {
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "cannot be less than 3")
      .max(100, "yikes to long")
      .required("enter title"),
    descr: Yup.string()
      .min(4, "too short")
      .max(1500, "yikes to long")
      .required("enter gist"),
  });

  const [imageElement, setImageElement] = useState<{
    src: string | undefined;
    name: string | undefined;
  } | null>(null);

  const takePicture = () => {};

  // const takePicture = async () => {
  //   const id = v4();

  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: true,
  //     resultType: CameraResultType.DataUrl,
  //   });

  //   // console.log(image);
  //   setImageElement({ src: image.dataUrl, name: id + image.format });
  // };

  // console.log(imageElement?.src?.split(",")[1]);
  const [present] = useIonToast();

  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonButton
              color='primary'
              onClick={() => onCloseNew()}
              size='large'>
              <IonIcon icon={arrowBack}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Share your Incident</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Image</IonCardTitle>
            <IonCardSubtitle>Add a png/Jpg file </IonCardSubtitle>
          </IonCardHeader>
          <IonImg src={imageElement?.src || placeholderImg} />

          <IonButton onClick={() => takePicture()}>
            <IonIcon icon={camera} slot='start' />
            Add Image
          </IonButton>
        </IonCard>

        <Formik
          initialValues={{ title: "", descr: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const uploadTask = async (src: string, name: string) =>
              await uploadString(
                ref(storage, name),
                src.split(",")[1],
                "base64",
                { cacheControl: "160000", contentType: "image/png" }
              ).then((task) => getDownloadURL(task.ref));
            if (!imageElement?.src || !imageElement.name) {
              try {
                await addDoc(collection(db, "incidents"), {
                  title: values.title,
                  body: values.descr,
                  creatorID: user?.uid,
                  timePosted: serverTimestamp(),
                });
                setImageElement(null);
                present({
                  message: "published",
                  duration: 1500,
                  position: "top",
                });
              } catch (err) {
                present({
                  message: "error",
                  duration: 1500,
                  position: "bottom",
                });
              }
            } else {
              try {
                const upload = await uploadTask(
                  imageElement.src,
                  imageElement.name
                );
                await addDoc(collection(db, "incidents"), {
                  title: values.title,
                  body: values.descr,
                  creatorID: user?.uid,
                  timePosted: serverTimestamp(),
                  imageURL: upload,
                });
                setImageElement(null);
                present({
                  message: "published",
                  duration: 1500,
                  position: "top",
                });
              } catch (err) {
                present({
                  message: "error",
                  duration: 1500,
                  position: "bottom",
                });
              }
            }
          }}>
          {({ values, handleChange, handleBlur }) => (
            <Form>
              <IonItem>
                <IonLabel position='floating'>Title</IonLabel>
                <IonInput
                  mode='ios'
                  placeholder='Title'
                  type='text'
                  name='title'
                  maxlength={100}
                  onBlur={handleBlur}
                  value={values.title}
                  onIonChange={handleChange}></IonInput>
              </IonItem>

              <IonItem>
                <IonText></IonText>
                <IonTextarea
                  mode='ios'
                  placeholder='Enter Incident description'
                  autoGrow={true}
                  name='descr'
                  maxlength={1000}
                  onBlur={handleBlur}
                  value={values.descr}
                  onIonChange={handleChange}></IonTextarea>
              </IonItem>
              <IonButton expand='block' type='submit'>
                <IonIcon icon={cloudUpload} slot='start'></IonIcon>
                Publish
              </IonButton>
            </Form>
          )}
        </Formik>
      </IonContent>
    </IonPage>
  );
};

export default AddIncident;
