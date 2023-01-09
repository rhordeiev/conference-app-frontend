import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Alert } from 'react-bootstrap';

export default function ConferencesPage() {
  const [conferences, setConferences] = useState([]);
  const [showFailureAlert, setShowFailureAlert] = useState(false);

  const toTopLinkRef = useRef();

  const getAllConferences = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/conference/list`);
      const responseJSON = await response.json();
      return responseJSON.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteConference = async (event) => {
    const conferenceId = event.target.parentNode.parentNode.id;
    try {
      await fetch(`${process.env.API_URL}/conference/${conferenceId}`, {
        method: 'DELETE',
      });
      setConferences(
        conferences.filter(
          (conference) => conference.id !== parseInt(conferenceId, 10),
        ),
      );
    } catch (error) {
      setShowFailureAlert(true);
      toTopLinkRef.current.click();
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    getAllConferences().then((fetchedCountries) =>
      setConferences(fetchedCountries),
    );
  }, []);

  return (
    <Container>
      <Button
        href="/new"
        variant="outline-secondary"
        className="float-right mt-3 mb-3"
      >
        New conference
      </Button>
      {showFailureAlert && (
        <>
          <br />
          <br />
          <br />
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
        </>
      )}
      <table className="table table-striped text-center">
        <thead className="table-dark">
          <tr>
            <td>Title</td>
            <td>Date</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {conferences.map((conference) => (
            <tr key={conference.id} id={conference.id}>
              <td>
                <Button variant="link" href={`conference/${conference.id}`}>
                  {conference.title}
                </Button>
              </td>
              <td>{conference.date}</td>
              <td>
                <Button variant="danger" onClick={deleteConference}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="#top" className="d-none" ref={toTopLinkRef}>
        To top
      </a>
    </Container>
  );
}
