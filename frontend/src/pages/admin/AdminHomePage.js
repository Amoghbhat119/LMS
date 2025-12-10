import { Container, Grid, Paper } from '@mui/material';
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { getSclassList } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { studentsList = [] } = useSelector((s) => s.student || {});
  const { sclassesList = [] } = useSelector((s) => s.sclass || {});
  const { teachersList = [] } = useSelector((s) => s.teacher || {});
  const { currentUser = null } = useSelector((s) => s.user || {});

  const adminID = useMemo(() => currentUser?._id || null, [currentUser]);

  useEffect(() => {
    if (!adminID) return;
    dispatch(getAllStudents(adminID));
    dispatch(getSclassList(adminID));
    dispatch(getAllTeachers(adminID));
  }, [adminID, dispatch]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} lg={3}>
          <StyledPaper>
            <img src={Students} alt="Students" />
            <Title>Total Students</Title>
            <Data start={0} end={studentsList.length} duration={2.5} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <StyledPaper>
            <img src={Classes} alt="Classes" />
            <Title>Total Classes</Title>
            <Data start={0} end={sclassesList.length} duration={2.5} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <StyledPaper>
            <img src={Teachers} alt="Teachers" />
            <Title>Total Teachers</Title>
            <Data start={0} end={teachersList.length} duration={2.5} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <StyledPaper>
            <img src={Fees} alt="Fees" />
            <Title>Fees Collection</Title>
            <Data start={0} end={23000} duration={2.5} prefix="$" />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <SeeNotice />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;
const Title = styled.p`font-size: 1.25rem;`;
const Data = styled(CountUp)`font-size: calc(1.3rem + .6vw); color: green;`;

export default AdminHomePage;
