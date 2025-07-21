// src/Component/JobSeeker/JobBoard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Header,
  Card,
  Button,
  Icon,
  Segment,
  Grid,
  Label,
  Loader,
  Message,
  Divider,
} from "semantic-ui-react";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:9001/joblisting/getall", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setLoading(false);
      });
  }, [token]);

  const handleApplyClick = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  if (loading) {
    return (
      <Segment basic style={{ marginTop: "6em" }}>
        <Loader active inline="centered" size="large" content="Loading jobs..." />
      </Segment>
    );
  }

  return (
    <div style={{ background: "#f9fafc", minHeight: "100vh", paddingTop: "6em", paddingBottom: "2em" }}>
      <Container>
        <Header as="h2" textAlign="center" style={{ color: "#2c3e50", marginBottom: "2em" }}>
          <Icon name="suitcase" color="blue" />
          <Header.Content>
            Explore Job Opportunities
            <Header.Subheader style={{ color: "#555", fontSize: "1rem", marginTop: "0.5em" }}>
              Discover openings that match your skills and experience.
            </Header.Subheader>
          </Header.Content>
        </Header>

        {jobs.length === 0 ? (
          <Message info icon>
            <Icon name="info circle" />
            <Message.Content>
              <Message.Header>No Jobs Available</Message.Header>
              We're constantly adding new jobs. Please check back later.
            </Message.Content>
          </Message>
        ) : (
          <Grid stackable columns={3} doubling>
            {jobs.map((job) => (
              <Grid.Column key={job.id}>
                <Card fluid raised style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                  <Card.Content>
                    <Header as="h3" style={{ marginBottom: "0.5em", color: "#2c3e50" }}>
                      {job.title}
                    </Header>
                    <Label basic color="teal" size="small" style={{ marginBottom: "0.8em" }}>
                      <Icon name="map marker alternate" /> {job.location}
                    </Label>

                    <Card.Description style={{ fontSize: "0.95rem", color: "#444" }}>
                      {job.description.length > 150
                        ? job.description.substring(0, 150) + "..."
                        : job.description}
                    </Card.Description>
                  </Card.Content>

                  <Card.Content extra>
                    <Label size="medium" color="green" ribbon>
                      ₹{job.salary}
                    </Label>

                    <Button
                      floated="right"
                      color="blue"
                      size="small"
                      onClick={() => handleApplyClick(job.id)}
                    >
                      <Icon name="paper plane" />
                      Apply Now
                    </Button>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default JobBoard;
