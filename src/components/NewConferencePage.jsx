/* eslint-disable function-paren-newline */
import React, { useEffect, useRef, useState } from 'react';
import { Container, Button, Form, Alert } from 'react-bootstrap';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { useForm } from 'react-hook-form';

export default function NewConferencePage() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [countries, setCountries] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showFailureAlert, setShowFailureAlert] = useState(false);

  const toTopLinkRef = useRef();
  const selectRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const containerStyle = {
    width: 'inherit',
    height: '55vh',
  };

  const getMarkerCoordinates = (marker) => {
    setLat(marker.latLng.lat());
    setLng(marker.latLng.lng());
  };
  const onMarkerClick = () => {
    setLat(null);
    setLng(null);
  };

  const getAllCountries = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}country/list`);
      const responseJSON = await response.json();
      return responseJSON.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    getAllCountries().then((fetchedCountries) =>
      setCountries(fetchedCountries),
    );
  }, []);

  async function onSubmit(formData) {
    const newConferenceData = new FormData();
    newConferenceData.append('title', formData.title);
    newConferenceData.append('date', formData.date);
    newConferenceData.append('lat', lat);
    newConferenceData.append('lng', lng);
    newConferenceData.append('country', selectRef.current.value);
    try {
      await fetch(`${process.env.API_URL}conference/new`, {
        method: 'POST',
        body: newConferenceData,
      });
      setShowFailureAlert(false);
      setShowSuccessAlert(true);
      toTopLinkRef.current.click();
    } catch (error) {
      setShowSuccessAlert(false);
      setShowFailureAlert(true);
      toTopLinkRef.current.click();
      throw new Error(error.message);
    }
  }

  return (
    <Container>
      <Button
        href="/"
        variant="outline-secondary"
        className="float-left mt-3 mb-2"
      >
        &#xab; Back
      </Button>
      <br />
      <br />
      <br />
      <Form onSubmit={handleSubmit(onSubmit)}>
        {showSuccessAlert && (
          <Alert variant="success" className="d-flex justify-content-between">
            Conference has been successfully created!
            <div className="d-flex justify-content-end">
              <Button
                onClick={() => setShowSuccessAlert(false)}
                variant="outline-success"
              >
                <span className="material-symbols-outlined d-flex">close</span>
              </Button>
            </div>
          </Alert>
        )}
        {showFailureAlert && (
          <Alert variant="danger" className="d-flex justify-content-between">
            Some error occurred on server. Please try again later
            <div className="d-flex justify-content-end">
              <Button
                onClick={() => setShowFailureAlert(false)}
                variant="outline-danger"
              >
                <span className="material-symbols-outlined d-flex">close</span>
              </Button>
            </div>
          </Alert>
        )}
        <Form.Group controlId="formConferenceTitle" className="mt-2 mb-2">
          <Form.Label>
            <h6>Title</h6>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter conference title"
            {...register('title', {
              required: true,
              minLength: 2,
              maxLength: 255,
            })}
          />
          {errors.title && (
            <Form.Text className="text-danger">
              The field is required and must contain from 2 to 255 letters.
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group controlId="formConferenceDate" className="mt-3 mb-3">
          <Form.Label>
            <h6>Date</h6>
          </Form.Label>
          <Form.Control
            type="date"
            placeholder="Enter conference date"
            {...register('date', {
              required: true,
            })}
          />
          {errors.date && (
            <Form.Text className="text-danger">
              The field is required.
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group controlId="formConferenceLocation" className="mt-3 mb-3">
          <Form.Label>
            <h6>Address</h6>
          </Form.Label>
          <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              zoom={6}
              center={{ lat: 48.3794, lng: 31.1656 }}
              onClick={getMarkerCoordinates}
            >
              {lat && lng ? (
                <MarkerF position={{ lat, lng }} onClick={onMarkerClick} />
              ) : (
                ''
              )}
            </GoogleMap>
          </LoadScript>
        </Form.Group>
        <Form.Group controlId="formConferenceCountry" className="mt-3 mb-3">
          <Form.Label>
            <h6>Country</h6>
          </Form.Label>
          <Form.Control as="select" {...register('country')} ref={selectRef}>
            {countries.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" className="float-right">
          Save
          <a href="#top" className="d-none" ref={toTopLinkRef}>
            To top
          </a>
        </Button>
      </Form>
    </Container>
  );
}
