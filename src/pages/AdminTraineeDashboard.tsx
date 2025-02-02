/* eslint-disable */
/* istanbul ignore file */

import React, { useState, useEffect, useContext } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import DataTable from '../components/DataTable';
import Sidebar from '../components/Sidebar';
import devs from '../dummyData/developers2.json';
import useDocumentTitle from '../hook/useDocumentTitle';
import Button from './../components/Buttons';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Avatar from '../assets/avatar.png';

import {
  GET_USERS_QUERY,
  GET_TRAINEES_QUERY,
  GET_COHORTS_QUERY,
  REMOVE_MEMBER_FROM_COHORT_MUTATION,
  EDIT_MEMBER_MUTATION,
  INVITE_USER_MUTATION,
  GET_TEAM_QUERY,
  ADD_MEMBER_TO_TEAM,
} from '../Mutations/manageStudentMutations';
import { useLazyQuery, useMutation } from '@apollo/client';
import ControlledSelect from '../components/ControlledSelect';
import { UserContext } from '../hook/useAuth';
const organizationToken = localStorage.getItem('orgToken');

const AdminTraineeDashboard = () => {
  useDocumentTitle('Trainees');
  const { t }: any = useTranslation();
  const { user } = useContext(UserContext);

  const [registerTraineeModel, setRegisterTraineeModel] = useState(false);
  const [removeTraineeModel, setRemoveTraineeModel] = useState(false);
  const [editTraineeModel, setEditTraineeModel] = useState(false);
  const [inviteTraineeModel, setInviteTraineeModel] = useState(false);
  const [traineeData, setTraineeData] = useState<any[]>([]);
  const [allUserEmail, setAllUserEmail] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [cohortName, setCohortName] = useState('');
  const [teams, setTeams] = useState<any[]>([]);
  const [email, setEmail] = useState<any[]>([]);
  const [traineeDetails, setTraineeDetails] = useState<any>({});
  const [selectedOption, setSelectedOption] = useState<any[]>([]);
  const [selectedOptionUpdate, setSelectedOptionUpdate] = useState<any>({});
  const [selectedTeamOptionUpdate, setSelectedTeamOptionUpdate] = useState<any>({});
  const [selectedOption2, setSelectedOption2] = useState<any[]>([]);
  const [selectedTeamOption, setSelectedTeamOption] = useState<any[]>([]);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleteFromCohort, setDeleteFromCohort] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCohort, setEditCohort] = useState('');
  const [editTeam, setEditTeam] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const options: any = [];
  const teamsOptions: any = [];
  const traineeOptions: any = [];
  const teamOptions: any = [];

  function PaperComponent(props: PaperProps) {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (rowData: any) => {
    const filteredUser = traineeData.filter((item) => item.email == rowData);
    setTraineeDetails(filteredUser[0]);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /* istanbul ignore next */
  const removeTraineeMod = () => {
    let newState = !removeTraineeModel;
    setRemoveTraineeModel(newState);
  };

  const removeModel = () => {
    let newState = !registerTraineeModel;
    setRegisterTraineeModel(newState);
  };

  /* istanbul ignore next */
  const removeEditModel = () => {
    let newState = !editTraineeModel;
    setEditTraineeModel(newState);
  };

  const inviteModel = () => {
    let newState = !inviteTraineeModel;
    setInviteTraineeModel(newState);
  };
  /* istanbul ignore next */
  const handleToggle = () => {
    setToggle(!toggle);
  };

  const [nav, setNav] = useState(false);
  const handleClick = () => setNav(!nav);

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : '#148FB6',
    }),
    valueLabel: (styles: any) => ({
      ...styles,
      text: 'white',
    }),
    control: (styles: any) => ({
      ...styles,
      height: 20,
      width: 370,
      backgroundColor: '#374151',
      borderColor: 'rgb(20 143 182)',
      text: 'white',
    }),
    singleValue: (provided: any, state: any) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
      /* istanbul ignore next */
      return { ...provided, opacity, transition };
    },
  };

  const columns = [
    { Header: t('name'), accessor: 'name' },
    { Header: t('email'), accessor: 'email' },
    { Header: t('rating'), accessor: 'rating' },
    { Header: t('Team'), accessor: 'team' },
    { Header: t('cohort'), accessor: 'cohort' },
    { Header: t('program'), accessor: 'program' },
    {
      Header: t('action'),
      accessor: '',
      Cell: ({ row }: any) => (
        <div
          className={
            ' items-center' + (traineeData?.length > 0 ? ' flex' : ' hidden')
          }
        >
          <Icon
            icon="el:file-edit-alt"
            className="mr-2"
            width="25"
            height="25"
            cursor="pointer"
            color="#148fb6"
            /* istanbul ignore next */
            onClick={() => {
              setSelectedOptionUpdate({value:row.original.cohort,label:row.original.cohort});
              setSelectedTeamOptionUpdate({value:row.original.team,label:row.original.team});
              console.log(selectedOption2);
              console.log(row.original.team);
              removeEditModel();
              setEditEmail(row.original.email);
              setEditCohort(row.original.cohort);
              setEditTeam(row.original.team);
            }}
          />
          <Icon
            icon="mdi:close-circle-outline"
            width="30"
            height="30"
            cursor="pointer"
            color="#148fb6"
            /* istanbul ignore next */
            onClick={() => {
              removeTraineeMod();
              setDeleteEmail(row.original.email);
              setDeleteFromCohort(row.original.team);
            }}
          />

          <Icon
            icon="flat-color-icons:view-details"
            width="30"
            height="30"
            cursor="pointer"
            color="#148fb6"
            onClick={() => handleClickOpen(row.original.email)}
          />
        </div>
      ),
    },
  ];

  const data = devs;
  let datum: any = [];
  const [getUsers] = useLazyQuery(GET_USERS_QUERY, {
    variables: {
      orgToken: organizationToken,
    },
  });
  const [getTraineesQuery] = useLazyQuery(GET_TRAINEES_QUERY, {
    variables: {
      orgToken: organizationToken,
    },
  });
  const [getCohortsQuery] = useLazyQuery(GET_COHORTS_QUERY, {
    variables: {
      orgToken: organizationToken,
    },
  });
  const [getTeamQuery] = useLazyQuery(GET_TEAM_QUERY, {
    variables: {
      orgToken: organizationToken,
      cohort: cohortName,
    },
  });
  function getTeam() {
    getTeamQuery({
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        setTeams(data.getAllTeamInCohort);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }
  /* istanbul ignore if */

  if (traineeData && traineeData.length > 0) {
    traineeData?.map((data: any, index: number) => {
      datum[index] = {};
      datum[index].name = data.profile ? data.profile.name : 'undefined';
      datum[index].email = data.email;
      datum[index].rating = '2';
      datum[index].team = data.team?.name;
      datum[index].cohort = data.team?.cohort?.name;
      datum[index].program = data.team?.cohort?.program?.name;
    });
  }

  const [addMemberToTeam] = useMutation(ADD_MEMBER_TO_TEAM, {
    variables: {
      teamName: Object.values(selectedTeamOption)[1],
      email: Object.values(email)[1],
      orgToken: organizationToken,
    },
    /* istanbul ignore next */
    onCompleted: (data) => {
      setTimeout(() => {
        setButtonLoading(false);
        toast.success(data.addMemberToTeam);
        removeModel();
      }, 500);
    },
    /* istanbul ignore next */
    onError: (err) => {
      setTimeout(() => {
        setButtonLoading(false);
        toast.error(err.message);
      }, 1000);
    },
  });

  const [editMemberMutation] = useMutation(EDIT_MEMBER_MUTATION, {
    variables: {
      removedFromTeamName: editTeam,
      addedToTeamName: selectedTeamOptionUpdate.value,
      email: editEmail,
      orgToken: organizationToken,
    },
    onCompleted: (data) => {
      handleToggle();

      setTimeout(() => {
        setButtonLoading(false);
        toast.success("Edit trainee's cohort successfully done!");
        removeEditModel();
      }, 500);
    },
    onError: (err) => {
      setTimeout(() => {
        setButtonLoading(false);
        toast.error(err.message);
      }, 1000);
    },
  });

  const [removeMemberFromCohort] = useMutation(
    REMOVE_MEMBER_FROM_COHORT_MUTATION,
    {
      variables: {
        teamName: deleteFromCohort,
        orgToken: organizationToken,
        email: deleteEmail,
      },
      onCompleted: (data) => {
        setTimeout(() => {
          setButtonLoading(false);
          toast.success(data.removeMemberFromCohort);
          removeTraineeMod();
        }, 1000);
      },
      onError: (err) => {
        setTimeout(() => {
          setButtonLoading(false);
          toast.error(err.message);
        }, 500);
      },
    },
  );

  const [inviteUser] = useMutation(INVITE_USER_MUTATION, {
    variables: {
      email: inviteEmail,
      orgToken: organizationToken,
    },
    onCompleted: (data) => {
      setTimeout(() => {
        setButtonLoading(false);
        toast.success(data.inviteUser);
        inviteModel();
      }, 1000);
    },
    onError: (err) => {
      setTimeout(() => {
        setButtonLoading(false);
        toast.error(err.message);
      }, 1000);
    },
  });
  useEffect(() => {
    getUsers({
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        setAllUserEmail(data.getUsers);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

    getTraineesQuery({
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        setTraineeData(data.getTrainees);
      },

      onError: (error) => {
        toast.error(error.message);
      },
    });

    getCohortsQuery({
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        setCohorts(data.getCohorts);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }, [registerTraineeModel, removeTraineeModel, toggle]);
  /* istanbul ignore if */
  if (allUserEmail.length > 0) {
    allUserEmail.map((trainee: any, index: any) => {
      traineeOptions[index] = {};
      traineeOptions[index].value = trainee.email;
      traineeOptions[index].label = trainee.email;
    });
  }
  /* istanbul ignore if */
  if (cohorts.length > 0) {
    cohorts.map((cohort: any, index: any) => {
      options[index] = {};
      options[index].value = cohort.name;
      options[index].label = cohort.name;
    });
  }
  if (teams.length > 0) {
    teams.map((team: any, index: any) => {
      teamsOptions[index] = {};
      teamsOptions[index].value = team.name;
      teamsOptions[index].label = team.name;
    });
  }
  if (teams.length > 0) {
    teams.map((team: any, index: any) => {
      teamOptions[index] = {};
      teamOptions[index].value = team?.name;
      teamOptions[index].label = team?.name;
    });
  }

  return (
    <>
      {/* =========================== Start::  InviteTraineeModel =============================== */}
      <div className=" dark:bg-dark-bg rounded-lg">
        <Dialog
          open={open}
          onClose={handleClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
          className="rounded-lg"
          fullWidth
        >
          <DialogContent className="dark:bg-dark-bg font-sans">
            <DialogContentText className=" dark:bg-dark-bg font-sans">
              <div className="font-bold text-sm dark:text-white text-center  dark:bg-dark-bg font-sans">
                <div className="bg-[#4aa5be] h-[150px]">
                  <img
                    className="absolute top-[80px] left-[40px] border-4 border-white font-sans"
                    style={{
                      margin: '0 auto',
                      borderRadius: '50%',
                      marginBottom: '20px',
                      width: '150px',
                      height: '150px',
                    }}
                    src={
                      traineeDetails &&
                      traineeDetails.profile &&
                      traineeDetails.profile.avatar
                        ? traineeDetails.profile.avatar
                        : Avatar
                    }
                    alt="Logo"
                  />
                </div>

                <h2
                  className="font-bold text-[18px]  capitalize pt-5 dark:text-white text-right dark:bg-dark-bg text-sm font-sans"
                  style={{ cursor: 'move', fontWeight: 'bold' }}
                  id="draggable-dialog-title"
                >
                  {traineeDetails && traineeDetails.profile
                    ? traineeDetails.profile.name
                    : 'Un availabe'}
                </h2>

                <div
                  className="text-sm font-sans"
                  style={{
                    display: 'flex',
                    gap: '50px',
                    justifyContent: 'space-between',
                    paddingBlock: '10px',
                    marginTop: '30px',
                    borderBottom: '0.5px solid #EAECEE',
                  }}
                >
                  {' '}
                  <h3>
                    <b>EMAIL</b>{' '}
                  </h3>
                  <p>
                    <i>
                      {' '}
                      {traineeDetails && traineeDetails.profile
                        ? traineeDetails.email
                        : 'Un availabe'}
                    </i>
                  </p>
                </div>
                <div
                  className="text-sm font-sans"
                  style={{
                    display: 'flex',
                    gap: '50px',
                    justifyContent: 'space-between',
                    paddingBlock: '10px',
                    marginTop: '30px',
                    borderBottom: '0.5px solid #EAECEE',
                  }}
                >
                  {' '}
                  <h3>
                    <b>START DATE</b>
                  </h3>
                  <p>
                    {traineeDetails && traineeDetails.team
                      ? traineeDetails.team.cohort.startDate.split('T')[0]
                      : 'Un availabe'}
                  </p>
                </div>
                <div
                  className="text-sm font-sans"
                  style={{
                    display: 'flex',
                    gap: '50px',
                    justifyContent: 'space-between',
                    paddingBlock: '10px',
                    borderBottom: '0.5px solid #EAECEE',
                  }}
                >
                  {' '}
                  <h3>
                    <b>PROGRAM</b>{' '}
                  </h3>
                  <p>
                    <i>
                      {' '}
                      {traineeDetails && traineeDetails.team
                        ? traineeDetails.team.cohort.program.name
                        : 'Un availabe'}
                    </i>
                  </p>
                </div>

                <div
                  className="text-sm font-sans"
                  style={{
                    display: 'flex',
                    gap: '50px',
                    justifyContent: 'space-between',
                    paddingBlock: '10px',
                    borderBottom: '0.5px solid #EAECEE',
                  }}
                >
                  {' '}
                  <h3>
                    <b>PHASE</b>{' '}
                  </h3>
                  <p>
                    <i>
                      {traineeDetails && traineeDetails.team
                        ? traineeDetails.team.cohort.phase.name
                        : 'Un availabe'}
                    </i>
                  </p>
                </div>

                <div
                  className="text-sm font-sans"
                  style={{
                    display: 'flex',
                    gap: '50px',
                    justifyContent: 'space-between',
                    paddingBlock: '10px',
                    marginBottom: '20px',
                    borderBottom: '0.5px solid #EAECEE',
                  }}
                >
                  {' '}
                  <h3>
                    <b>COHORT</b>{' '}
                  </h3>
                  <p>
                    <i>
                      {' '}
                      {traineeDetails && traineeDetails.team
                        ? traineeDetails.team.cohort.name
                        : 'Un availabe'}
                    </i>
                  </p>
                </div>
                <div
                  className="text-sm font-sans"
                  style={{
                    display: 'flex',
                    gap: '50px',
                    justifyContent: 'space-between',
                    paddingBlock: '10px',
                    marginBottom: '20px',
                    borderBottom: '0.5px solid #EAECEE',
                  }}
                >
                  {' '}
                  <h3>
                    <b>MANAGER</b>{' '}
                  </h3>
                  <p>
                    <i>
                      {' '}
                      {traineeDetails && traineeDetails.team
                        ? traineeDetails.team.cohort.program.manager.profile
                            .name
                        : 'Un availabe'}
                    </i>
                  </p>
                </div>
                <Button
                  data-testid="removeInviteModel"
                  variant="info"
                  size="sm"
                  style="w-[20%] md:w-1/4 text-sm font-sans"
                  onClick={() => handleClose()}
                >
                  {t('Close')}
                </Button>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
      {/* =========================== Start::  InviteTraineeModel =============================== */}

      <div
        className={`h-screen w-screen z-20 bg-black bg-opacity-30 backdrop-blur-sm absolute flex items-center justify-center  px-4 ${
          inviteTraineeModel === true ? 'block' : 'hidden'
        }`}
      >
        <div className="bg-white dark:bg-dark-bg w-full sm:w-3/4  xl:w-4/12 rounded-lg p-4 pb-8">
          <div className="card-title w-full flex  flex-wrap justify-center items-center  ">
            <h3 className="font-bold text-sm dark:text-white text-center w-11/12 ">
              {t('Send Invitation')}
            </h3>
            <hr className=" bg-primary border-b my-3 w-full" />
          </div>
          <div className="card-body">
            <form className=" py-3 px-8">
              <div className="card-title w-full flex  flex-wrap justify-center items-center  ">
                <h3 className="font-bold text-sm dark:text-white text-center w-11/12 ">
                  {t('Fill in the email to invite a user to DevPulse.')}
                </h3>
              </div>

              <div className="text-white input my-3 h-9 ">
                <div className="text-white grouped-input flex items-center h-full w-full rounded-md">
                  <input
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value);
                    }}
                    type="email"
                    name="email"
                    className=" dark:bg-dark-tertiary text-black border border-primary py-2 rounded outline-none px-5 font-sans text-xs w-full"
                    placeholder={t('email')}
                  />
                </div>
              </div>

              <div className="w-full flex justify-between">
                <Button
                  data-testid="removeInviteModel"
                  variant="info"
                  size="sm"
                  style="w-[30%] md:w-1/4 text-sm font-sans"
                  onClick={() => inviteModel()}
                >
                  {t('Cancel')}
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  style="w-[30%] md:w-1/4 text-sm font-sans"
                  onClick={() => {
                    setButtonLoading(true);
                    inviteUser();
                  }}
                  loading={buttonLoading}
                >
                  {t('Invite')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* =========================== End::  InviteTraineeModel =============================== */}

      {/* =========================== Start::  EditTraineeModel =============================== */}

      <div
        className={`h-screen w-screen z-20 bg-black bg-opacity-40 backdrop-blur-sm absolute flex items-center justify-center  px-4 ${
          editTraineeModel === true ? 'block' : 'hidden'
        }`}
      >
        <div className="bg-white dark:bg-dark-bg w-full sm:w-3/4  xl:w-4/12 rounded-lg p-4 pb-8">
          <div className="card-title w-full flex  flex-wrap justify-center items-center  ">
            <h3 className="font-bold text-sm dark:text-white text-center w-11/12 ">
              {t('Edit Trainee')}
            </h3>
            <hr className=" bg-primary border-b my-3 w-full" />
          </div>
          <div className="card-body">
            <form className=" py-3 px-8">
              <div className="card-title w-full flex  flex-wrap justify-center items-center  ">
                <h3 className="font-bold text-sm dark:text-white text-center w-11/12 ">
                  {t(
                    'Choose a different cohort for the trainee from the dropdown below.',
                  )}
                </h3>
              </div>

              <div className="text-white input my-3 h-9 ">
                <div className="text-white grouped-input flex items-center h-full w-full rounded-md">
                  <ControlledSelect
                    placeholder={t('Select cohort')}
                    defaultValue={selectedOptionUpdate}
                    noRegister={{
                      onChange: (e) => {
                        setSelectedOptionUpdate(e);
                        setSelectedTeamOptionUpdate({value:'',label:'Select team'});
                        setCohortName(e.value);
                        getTeam();
                      },
                    }}
                    options={options}
                  />
                </div>
              </div>
              <div className="text-white input my-3 h-9 ">
                <div className="text-white grouped-input flex items-center h-full w-full rounded-md">
                  <ControlledSelect
                    placeholder={t('Select team')}
                    defaultValue={selectedTeamOptionUpdate}
                    noRegister={{
                      onChange: (e) => {
                        setSelectedTeamOptionUpdate(e);
                      },
                    }}
                    options={teamsOptions.filter((option: any) => {
                      return option.value !== editTeam;
                    })}
                  />
                </div>
              </div>

              <div className="w-full flex justify-between">
                <Button
                  data-testid="removeModel1"
                  variant="info"
                  size="sm"
                  style="w-[30%] md:w-1/4 text-sm font-sans"
                  onClick={() => removeEditModel()}
                >
                  {t('Cancel')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  style="w-[30%] md:w-1/4 text-sm font-sans"
                  onClick={() => {
                    setButtonLoading(true);
                    setButtonLoading(true);
                    if (editEmail && editCohort) {
                      editMemberMutation();
                    } else {
                      toast.error('Please select the trainee again ');
                    }
                  }}
                  loading={buttonLoading}
                >
                  {t('Proceed')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* =========================== End::  EditTraineeModel =============================== */}

      {/* =========================== Start::  RemoveTraineeModel =============================== */}

      <div
        className={`h-screen w-screen z-20 bg-black bg-opacity-30 backdrop-blur-sm absolute flex items-center justify-center  px-4 ${
          removeTraineeModel === true ? 'block' : 'hidden'
        }`}
      >
        <div className="bg-white dark:bg-dark-bg w-full sm:w-3/4  xl:w-4/12 rounded-lg p-4 pb-8">
          <div className="card-title w-full flex  flex-wrap justify-center items-center  ">
            <h3 className="font-bold text-sm dark:text-white text-center w-11/12 ">
              {t('Remove Trainee')}
            </h3>
            <hr className=" bg-primary border-b my-3 w-full" />
          </div>
          <div className="card-body">
            <form className=" py-3 px-8">
              <div className="card-title w-full flex  flex-wrap justify-center items-center  ">
                <h3 className="font-bold text-sm dark:text-white text-center w-11/12 ">
                  {t(
                    'Are you sure you want to remove trainee from this cohort?',
                  )}
                </h3>
              </div>

              <div className="w-full flex justify-between">
                <Button
                  data-testid="removeModel2"
                  variant="info"
                  size="sm"
                  style="w-[30%] md:w-1/4 text-sm font-sans"
                  onClick={() => removeTraineeMod()}
                >
                  {t('Cancel')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  data-testid="removeMemberFromCohort"
                  style="w-[30%] md:w-1/4 text-sm font-sans"
                  onClick={() => {
                    setButtonLoading(true);
                    if (deleteEmail && deleteFromCohort) {
                      removeMemberFromCohort();
                    } else {
                      toast.error('Please select the trainee again ');
                    }
                  }}
                  loading={buttonLoading}
                >
                  {t('Proceed')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* =========================== End::  RemoveTraineeModel =============================== */}

      {/* =========================== Start::  AddTraineeModel =============================== */}

      <div
        className={`h-screen w-screen z-20 bg-black bg-opacity-30 backdrop-blur-sm absolute flex items-center justify-center  px-4 ${
          registerTraineeModel === true ? 'block' : 'hidden'
        }`}
      >
        <div className="bg-white dark:bg-dark-bg w-full sm:w-3/4  xl:w-4/12 rounded-lg p-4 pb-8">
          <div className="card-title w-full flex  flex-wrap justify-center items-center  ">
            <h3 className="font-bold text-sm dark:text-white text-center w-11/12 ">
              {t('Add Trainee')}
            </h3>
            <hr className=" bg-primary border-b my-3 w-full" />
          </div>
          <div className="card-body">
            <form className=" py-3 px-8">
              <div className="input my-3 h-9 ">
                <div className="grouped-input flex items-center h-full w-full rounded-md">
                  <Select
                    placeholder={t('choose trainee')}
                    className="my-react-select-container"
                    classNamePrefix="my-react-select"
                    styles={customStyles}
                    defaultValue={email}
                    onChange={(e) => {
                      setEmail(e);
                      // setSelectedOption2(e);
                    }}
                    options={traineeOptions}
                    isSearchable
                  />
                </div>
              </div>

              <div className="text-white input my-3 h-9 ">
                <div className="text-white grouped-input flex items-center h-full w-full rounded-md">
                  <ControlledSelect
                    placeholder={t('Select cohort')}
                    defaultValue={selectedOption}
                    noRegister={{
                      onChange: (e) => {
                        setSelectedOption(e);
                        setCohortName(e.value);
                        getTeam();
                      },
                    }}
                    options={options}
                  />
                </div>
              </div>

              <div className="text-white input my-3 h-9 ">
                <div className="text-white grouped-input flex items-center h-full w-full rounded-md">
                  <ControlledSelect
                    placeholder={t('Select Team')}
                    defaultValue={selectedTeamOption}
                    noRegister={{
                      onChange: (e) => {
                        setSelectedTeamOption(e);
                      },
                    }}
                    options={teamOptions}
                  />
                </div>
              </div>

              <div className="w-full flex justify-between">
                <Button
                  data-testid="removeModel"
                  variant="info"
                  size="sm"
                  style="w-[30%] md:w-1/4 text-sm font-sans"
                  onClick={() => removeModel()}
                >
                  {t('Cancel')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  data-testid="saveButton"
                  style="w-[30%] md:w-1/4 text-sm font-sans"
                  onClick={() => {
                    setButtonLoading(true);
                    addMemberToTeam();
                  }}
                  loading={buttonLoading}
                >
                  {t('save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* =========================== End::  AddTraineeModel =============================== */}

      <div className="flex flex-col h-screen">
        <div className="flex flex-row">
          <Sidebar toggle={handleClick} style="hidden lg:flex" />
          <div className="w-full">
            <div>
              <div className="bg-light-bg dark:bg-dark-frame-bg  min-h-screen overflow-y-auto overflow-x-hidden">
                <div className="flex items-left px-10 lg:px-60 pt-24 pb-8">
                  <div className="space-x-8 lg:ml-7">
                    <Button
                      variant="primary"
                      size="lg"
                      data-testid="registerModel"
                      onClick={removeModel}
                    >
                      {' '}
                      {t('add')} +{' '}
                    </Button>

                    {user?.role === 'coordinator' || undefined ? (
                      ''
                    ) : (
                      <Button
                        variant="primary"
                        size="lg"
                        data-testid="inviteModel"
                        onClick={inviteModel}
                      >
                        {t('Invite')}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="px-3 md:px-8">
                  <DataTable
                    data={traineeData?.length > 0 ? datum : [{}]}
                    columns={columns}
                    title={t('Trainees list')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTraineeDashboard;
