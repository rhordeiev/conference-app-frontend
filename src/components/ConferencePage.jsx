import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

export default function ConferencePage() {
  const [conferenceTitle, setConferenceTitle] = useState('');
  const [conferenceDate, setConferenceDate] = useState('');
  const [conferenceLat, setConferenceLat] = useState(null);
  const [conferenceLng, setConferenceLng] = useState(null);
  const [conferenceCountry, setConferenceCountry] = useState('');
  const [showFailureAlert, setShowFailureAlert] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();

  const toTopLinkRef = useRef();

  const containerStyle = {
    width: 'inherit',
    height: '55vh',
  };

  const getConference = async (conferenceId) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/conference/list?id=${conferenceId}`,
      );
      const responseJSON = await response.json();
      return responseJSON.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteConference = async (conferenceId) => {
    try {
      await fetch(`${process.env.API_URL}/conference/${conferenceId}`, {
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
    getConference(id).then((fetchedConference) => {
      setConferenceTitle(fetchedConference.title);
      setConferenceDate(fetchedConference.date);
      setConferenceLat(fetchedConference.address_lat);
      setConferenceLng(fetchedConference.address_lng);
      setConferenceCountry(fetchedConference.country_name);
    });
  }, []);

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
      <Form>
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
          <Form.Control type="text" value={conferenceTitle} readOnly />
        </Form.Group>
        <Form.Group controlId="formConferenceDate" className="mt-3 mb-3">
          <Form.Label>
            <h6>Date</h6>
          </Form.Label>
          <Form.Control type="date" value={conferenceDate} readOnly />
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
                lat: conferenceLat || 48.3794,
                lng: conferenceLng || 31.1656,
              }}
            >
              <MarkerF position={{ lat: conferenceLat, lng: conferenceLng }} />
            </GoogleMap>
          </LoadScript>
        </Form.Group>
        <Form.Group controlId="formConferenceCountry" className="mt-3 mb-3">
          <Form.Label>
            <h6>Country</h6>
          </Form.Label>
          <Form.Control type="text" value={conferenceCountry} readOnly />
        </Form.Group>
        <Button
          variant="danger"
          className="float-right"
          onClick={() => {
            deleteConference(id);
          }}
        >
          Delete
        </Button>
        <a
          className="btn btn-warning mr-3 float-right"
          role="button"
          href={`/conference/edit/${id}`}
        >
          Edit
        </a>
      </Form>
      <a href="#top" className="d-none" ref={toTopLinkRef}>
        To top
      </a>
    </Container>
  );
}
