import React, { useEffect, useRef, useState } from 'react';
import { Container, Button, Form, Alert } from 'react-bootstrap';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditConferencePage() {
  const [conferenceLat, setConferenceLat] = useState(null);
  const [conferenceLng, setConferenceLng] = useState(null);
  const [conferenceCountry, setConferenceCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showFailureAlert, setShowFailureAlert] = useState(false);
  const [centerValueCanChange, setCenterValueCanChange] = useState(true);

  const toTopLinkRef = useRef();
  const selectRef = useRef();

  const { id } = useParams();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const containerStyle = {
    width: 'inherit',
    height: '55vh',
  };

  const getMarkerCoordinates = (marker) => {
    setCenterValueCanChange(false);
    setConferenceLat(marker.latLng.lat());
    setConferenceLng(marker.latLng.lng());
  };
  const onMarkerClick = () => {
    setConferenceLat(null);
    setConferenceLng(null);
  };

  const getAllCountries = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/country/list`);
      const responseJSON = await response.json();
      return responseJSON.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getConference = async (conferenceId) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}conference/list?id=${conferenceId}`,
      );
      const responseJSON = await response.json();
      return responseJSON.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteConference = async (conferenceId) => {
    try {
      await fetch(`${process.env.API_URL}conference/${conferenceId}`, {
        method: 'DELETE',
      });
      navigate('/');
    } catch (error) {
      setShowFailureAlert(true);
      toTopLinkRef.current.click();
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    getAllCountries().then((fetchedCountries) =>
      setCountries(fetchedCountries),
    );
    getConference(id).then((fetchedConference) => {
      setConferenceLat(fetchedConference.address_lat);
      setConferenceLng(fetchedConference.address_lng);
      setConferenceCountry(fetchedConference.country_name);
      const defaultValues = {
        title: fetchedConference.title,
        date: fetchedConference.date,
      };
      reset(defaultValues);
    });
  }, []);

  useEffect(() => {
    selectRef.current.value = conferenceCountry;
  }, [conferenceCountry]);

  async function onSubmit(formData) {
    const newConferenceData = new FormData();
    newConferenceData.append('title', formData.title);
    newConferenceData.append('date', formData.date);
    newConferenceData.append('lat', conferenceLat);
    newConferenceData.append('lng', conferenceLng);
    newConferenceData.append('country', selectRef.current.value);
    try {
      await fetch(`${process.env.API_URL}conference/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          date: formData.date,
          lat: conferenceLat,
          lng: conferenceLng,
          country: selectRef.current.value,
        }),
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
        href={`/conference/${id}`}
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
            New conference data has been successfully saved!
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
              center={{
                lat: centerValueCanChange && (conferenceLat || 48.3794),
                lng: centerValueCanChange && (conferenceLng || 31.1656),
              }}
              onClick={getMarkerCoordinates}
            >
              {conferenceLat && conferenceLng ? (
                <MarkerF
                  position={{ lat: conferenceLat, lng: conferenceLng }}
                  onClick={onMarkerClick}
                />
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
        <Button
          variant="danger"
          type="click"
          className="float-right"
          onClick={() => {
            deleteConference(id);
          }}
        >
          Delete
        </Button>
        <Button variant="success" type="submit" className="float-right mr-3">
          Save
        </Button>
      </Form>
      <a href="#top" className="d-none" ref={toTopLinkRef}>
        To top
      </a>
    </Container>
  );
}
