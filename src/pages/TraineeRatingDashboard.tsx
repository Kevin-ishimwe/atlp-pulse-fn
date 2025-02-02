/* eslint-disable */
import gql from 'graphql-tag';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import React, { useState, Fragment, useEffect, Suspense } from 'react';
import { Listbox, Combobox, Transition, Dialog } from '@headlessui/react';
import { CheckIcon, SelectorIcon, PlusIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';
import Square from '../Skeletons/Square';
import Skeleton from '../components/Skeleton';
import {
  ADD_REPLY,
  GET_REPLIES,
  GET_REPLIES_BY_USER,
} from '../Mutations/replyMutation';
import { REMOVE_REPLY } from '../Mutations/replyMutation';
import useDocumentTitle from '../hook/useDocumentTitle';
import Sidebar from '../components/Sidebar';
import Button from '../components/Buttons';
import { DEFAULT_GRADE } from '../Mutations/MakeDefault';
import {
  GET_RATINGS,
  ADD_RATING,
  UPDATE_RATING,
  GET_USERS,
  RATING_BY_COHORT,
  FETCH_ALL_RATINGS,
} from '../Mutations/Ratings';
import { GET_COHORTS_QUERY } from '../Mutations/manageStudentMutations';

import { GET_COHORT_TRAINEES_QUERY } from '../Mutations/manageStudentMutations';
import { phase, sprint } from '../dummyData/ratings';
import DataTable from '../components/DataTable';
import { useLazyQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import GRADING_SYSTEM_QUERY from './GradingSystemQuery';
import { useQuery } from '@apollo/client';
import GradingSystem from './GradingSystem';

function classNames(...classes: any) {
  /* istanbul ignore next */
  return classes.filter(Boolean).join(' ');
}


const TraineeRatingDashboard = () => {
  const organizationToken = localStorage.getItem('orgToken');

  useDocumentTitle('Ratings');
  const { t } = useTranslation();
  const [nav, setNav] = useState(false);
  const [trainee, setTrainee] = useState<any>([]);
  const [cohorts, setCohorts] = useState<any>([]);
  const [selectedCohort, setSelectedCohort] = useState(cohorts[0]);
  const [selectedUser, setSelectedUser] = useState<any>([]);
  const [selectedSprint, setSelectedSprint] = useState(sprint[0]);
  const [cohortName, setCohortName] = useState({ cohortName: '' });

  const [disable, setDisable] = useState(true);
  const [ratingData, setRatingData] = useState({
    quality: '0',
    qualityRemark: '',
    quantity: '0',
    quantityRemark: '',
    professional: '0',
    professionalRemark: '',
    userEmail: '',
    average: '',
  });
  const [rows, setRows] = useState({
    quality: '0',
    qualityremark: '',
    quantity: '0',
    quantityremark: '',
    professional: '0',
    professionalRemark: '',
    bodyQuantity: '',
    bodyQuality: '',
    bodyProfessional: '',
    sprint: '0',
    user: '',
    id: '',
  });
  /* istanbul ignore next */
  let [isOpen, setIsOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showRemarks, setShowRemarks] = useState(false);
  const [ratings, setRatings] = useState<any>([]);
  const [trainees, setTrainees] = useState<any>([]);
  const [ratingsByCohort, setRatingsByCohort] = useState<any>([]);
  const [defaultGrading, setDefaultGrading] = useState<any>([]);
  const [selectedTrainee, setSelectedTrainee] = useState(trainee[0]);
  const [query, setQuery] = useState('');
  const [toggle, setToggle] = useState(false);
  /* istanbul ignore next */
  const filteredTrainees =
    query === ''
      ? trainee
      : trainee.filter((trainee: any) =>
          trainee?.email
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')),
        );
  /* istanbul ignore next */
  const filteredcohorts =
    query === ''
      ? cohorts
      : cohorts.filter((cohorts: any) =>
          cohorts?.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')),
        );

  const closeModal = /* istanbul ignore next */ 
  () => {
    /* istanbul ignore next */
    // setIsOpen(false);
    /* istanbul ignore next */
    setShowActions(false);
    /* istanbul ignore next */
    setShowRemarks(false);
  };
  const closeCancel = () => {
    /* istanbul ignore next */
    setIsOpen(false);
    /* istanbul ignore next */
    setShowActions(false);
    /* istanbul ignore next */
    setShowRemarks(false);
  }
  const openModal = () => {
    setIsOpen(true);
  };
  const handleClick =
    /* istanbul ignore next */
    () =>
      /* istanbul ignore next */
      setNav(!nav);
  const handleToggle = /* istanbul ignore next */ 
  () => {
    /* istanbul ignore next */
    setToggle(!toggle);
  };

  const handleSubmit = /* istanbul ignore next */ 
  (e: any) => {
    /* istanbul ignore next */
    e.preventDefault();
    /* istanbul ignore next */
    createRatings();
    /* istanbul ignore next */
    handleToggle();
    /* istanbul ignore next */
  };

  const handleUpdate = (e: any) => {
    /* istanbul ignore next */
    e.preventDefault();
    /* istanbul ignore next */
    updateRatings();
    /* istanbul ignore next */
    handleToggle();
    /* istanbul ignore next */
    closeModal();
  };
  const handleRatingChange = (e: any) => {
      /* istanbul ignore next */
    setRatingData((prevRatingData) => {
      /* istanbul ignore next */
      return {
        ...prevRatingData,
        [e.target.name]: e.target.value,
      };
    });
  };
  const vardata = ratingsByCohort;
  /* istanbul ignore next */
 
  const columns = [
    { Header: `${t('Email')}`, accessor: 'user[email]' },
    { Header: `${t('Phase')}`, accessor: 'cohort[phase[name]]' },
    { Header: `${t('Sprint')}`, accessor: 'sprint' },
    { Header: `${t('Quantity')}`, accessor: 'quantity' },
    { Header: `${t('Quality')}`, accessor: 'quality' },
    { Header: `${t('Professional skills')}`, accessor: 'professional_Skills' },
   
    { Header: `${t('Average')}`, accessor:  'average' },
    {
      Header: `${t('Actions')}`,
      accessor: '',
      Cell: ({ row }: any) => (
        <div className="flex flex-row">
          <div className="cursor-pointer">
            <Icon
              icon="bx:edit-alt"
              color="#148fb6"
              onClick={() => {
                setShowActions(!showActions);
                setRows({
                  ...rows,
                  quality: row.original.quality,
                  qualityremark: row.original.qualityRemark,
                  quantity: row.original.quantity,
                  quantityremark: row.original.quantityRemark,
                  professional: row.original.professional_Skills,
                  professionalRemark: row.original.professionalRemark,
                  sprint: row.original.sprint,
                  user: row.original.user.email,
                  id: row.original.user.id,
                });
                
              }}
            />
          </div>
        </div>
      ),
    },
    {
      Header: `${t('Remarks')}`,
      accessor: '',
      Cell: ({ row }: any) => (
        <div className="flex flex-row">
          <div className="cursor-pointer">
            <Icon
              icon="ant-design:comment-outlined"
              width="25"
              height="25"
              color="#148fb6"
              onClick={() => {
                setShowRemarks(!showRemarks);
                setShowActions(!showActions);
                setRows({
                  ...rows,
                  quality: row.original.quality,
                  qualityremark: row.original.qualityRemark,
                  bodyQuality: row.original.bodyQuality,
                  quantity: row.original.quantity,
                  quantityremark: row.original.quantityRemark,
                  bodyQuantity: row.original.bodyQuantity,
                  professional: row.original.professional_Skills,
                  professionalRemark: row.original.professionalRemark,
                  bodyProfessional: row.original.bodyProfessional,
                  sprint: row.original.sprint,
                  user: row.original.user.email,
                  id: row.original.user.id,
                });
              }}
            />
          </div>
        </div>
      ),
    },
  ];
  /* istanbul ignore next */
  const [createRatings] = useMutation(ADD_RATING, {
    variables: {
      cohort: selectedCohort?.id,
      user: ratingData.userEmail,
      sprint: selectedSprint.name,
      quantity: ratingData.quantity.toString(),
      quantityRemark: ratingData.quantityRemark.toString(),
      quality: ratingData.quality.toString(),
      qualityRemark: ratingData.qualityRemark.toString(),
      professionalSkills: ratingData.professional.toString(),
      professionalRemark: ratingData.professionalRemark.toString(),
      orgToken: organizationToken,
    },
    onError: (err) => {
      toast.error(err.message || 'Something went wrong');
      openModal();
    },
    onCompleted: ({ createRatings }) => {
      handleToggle();
      closeCancel();
      toast.success('Successfully done');
    },
  });
  /* istanbul ignore next */
  const [updateRatings] = useMutation(UPDATE_RATING, {
    variables: {
      user: rows.id,
      sprint: rows.sprint,
      quantity: rows?.quantity,
      quantityRemark: rows?.quantityremark,
      quality: rows?.quality,
      qualityRemark: rows?.qualityremark,
      professionalSkills: rows?.professional,
      professionalRemark: rows?.professionalRemark,
      orgToken: organizationToken,
    },
    onError: (err) => {
      toast.error(err.message || 'something went wrong');
      setShowActions(true);
    },
    onCompleted: (data) => {
      toast.success('Successfully updated!');
    },
  });
  const [DefaultGrade] = useLazyQuery(DEFAULT_GRADE, {})

  const [getRatings] = useLazyQuery(GET_RATINGS, {
    variables: {
      orgToken: organizationToken,
    },
  });
  const [RatingByCohort] = useLazyQuery(RATING_BY_COHORT, {
    variables: {
      cohortName: selectedCohort?.name,
    },
  });


  // const [getTraineesCohorts] = useLazyQuery(GET_COHORT_TRAINEES_QUERY, {
  //   variables: {
  //   orgToken: organizationToken,
  //   cohort: cohortName,
  //   }
  //   });
  
  const [getCohorts] = useLazyQuery(GET_COHORTS_QUERY, {
    variables: {
      orgToken: organizationToken,
    },
  });

  const [getUsers] = useLazyQuery(GET_COHORT_TRAINEES_QUERY, {
    variables: {
      orgToken: organizationToken,
      cohort: cohortName,
    },
  });

  const { data } = useQuery(GRADING_SYSTEM_QUERY);

  useEffect(() => {
    getRatings({
      fetchPolicy: 'network-only',
      /* istanbul ignore next */
      onCompleted: (data) => {
        /* istanbul ignore next */
        setRatings(data?.fetchRatings);
        
      },
      onError: /* istanbul ignore next */ 
      (error) => {
        /* istanbul ignore next */
        toast.error(error?.message || 'Failed to load the data');
      },
    });
 
    DefaultGrade({
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        /* istanbul ignore next */
        setDefaultGrading(data?.getDefaultGrading[0]?.grade)
        
      },
    onError: (error) => {
      /* istanbul ignore next */
        toast.error(error?.message || 'Failed to load the data');
      },
    })

    getCohorts({
      fetchPolicy: 'network-only',
      /* istanbul ignore next */
      onCompleted: (data) => {
        /* istanbul ignore next */
        const cohorts = data?.getCohorts;
        /* istanbul ignore next */
        data?.getCohorts?.length !== 0
          ? setCohorts(cohorts)
          : setCohorts(cohorts);
      },
      onError: (error) => {
      /* istanbul ignore next */
        toast.error(error?.message || 'Failed to load the data');
      },
    });
  }, [toggle, updateRatings]);

  /* istanbul ignore next */

  const defaultRating = data?.getDefaultGrading?.filter(
    (x: any) => x.defaultGrading,
  );

  function getRatingByCohort() {
    /* istanbul ignore next */
    RatingByCohort({
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        /* istanbul ignore next */
        setRatingsByCohort(data?.fetchRatingByCohort);
        
      },
      onError: (error) => {
      /* istanbul ignore next */
        toast.error(error?.message || 'Failed to load the data');
      },
    });
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-light-bg dark:bg-dark-frame-bg">
        <div className="flex flex-row">
          <Sidebar toggle={handleClick} style="hidden lg:flex" />
          <div className="w-full">
            <div>
              <div className="bg-light-bg dark:bg-dark-frame-bg max-h-full overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col w-3/5 mx-auto md:flex-row relative  justify-between px-2 md:px-5 lg:px-10 pt-24 pb-8 mt-4">
                  {/* SELECT COHORT DROPDOWN START */}
                  <div className="flex flex-col md:ml-a w-40">
                    <Listbox
                      value={selectedCohort}
                      onChange={
                        /* istanbul ignore next */ 
                        (e) => {
                          /* istanbul ignore next */
                          setSelectedCohort(e);
                          setCohortName(e.name);
                          setDisable(false);
                          getUsers({
                            fetchPolicy: 'network-only',
                            /* istanbul ignore next */
                            onCompleted: (data) => {
                                setTrainee(data?.getCohortTrainees)
                              /* istanbul ignore next */
                              
                            },
                            onError: /* istanbul ignore next */ 
                            (error) => {
                              /* istanbul ignore next */
                              toast.error(
                                error?.message || 'Something went wrong',
                              );
                            },
                          });
                          getRatingByCohort()
                        }
                      }
                    >
                      {({ open }) => (
                        <>
                          <Listbox.Label className="block text-lg font-medium text-gray-700 dark:text-dark-text-fill mt-2">
                            {t('Cohort')}
                          </Listbox.Label>
                          <div className="relative mt-1">
                            <Listbox.Button
                              className="relative md:w-full p-30 h-8 cursor-default rounded-md border border-primary bg-primary py-2 pl-3 pr-10 text-left shadow-sm focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm"
                              data-testid="cohortList"
                            >
                              <span className="flex items-center">
                                <span className="ml-3 block truncate text-white">
                                  {selectedCohort?.name}
                                </span>
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <SelectorIcon
                                  className="h-5 w-5 text-white"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              show={open}
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-1/2 md:w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {cohorts?.map((cohort: any) => (
                                  <Listbox.Option
                                    key={cohort?.id}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? 'text-white bg-primary'
                                          : 'text-gray-900',
                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                      )
                                    }
                                    value={cohort}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <div className="flex items-center">
                                          <span
                                            className={classNames(
                                              selected
                                                ? 'font-semibold'
                                                : 'font-normal',
                                              'ml-3 block truncate',
                                            )}
                                          >
                                            {cohort?.name}
                                          </span>
                                        </div>
                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active
                                                ? 'text-white'
                                                : 'text-primary',
                                              'absolute inset-y-0 right-0 flex items-center pr-4',
                                            )}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </>
                      )}
                    </Listbox>
                  </div>

                  {/* SELECT COHORT DROPDOWN END */}

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={openModal}
                      data-testid="addRatingButton"
                      className="rounded-md w-40 text-base flex flex-row bg-primary p-3 font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                    >
                      {t('Add New Rating')}
                      <PlusIcon className="w-4 mt-1" />
                    </button>
                  </div>
                  {/* ADD NEW RATINGS MODAL START*/}
                  <Transition
                    appear
                    show={isOpen}
                    as={Fragment}
                    data-testid="modalTransistion"
                  >
                    <Dialog
                      as="div"
                      className="relative z-10"
                      onClose={closeModal}
                    >
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                      </Transition.Child>
                      <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full  items-center justify-center p-4 text-center">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Dialog.Panel className="w-full overflow-auto lg:mx-60 xl:mx-96 h-[800px] md:h-[600px] transform  rounded-2xl bg-white dark:bg-dark-bg p-6 text-left align-middle shadow-xl transition-all">
                              <form onSubmit={handleSubmit}>
                                <Dialog.Title
                                  as="h3"
                                  className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-text-fill"
                                >
                                  {t('Add New Trainee Rating')}
                                </Dialog.Title>
                                {/* SELECT TRAINEE DROPDOWN START */}
                                <div className="mt-10 md:mt-12 grid grid-cols-4">
                                  <Combobox
                                    value={selectedUser}
                                    onChange={(e) => {
                                      /* istanbul ignore next */
                                      setSelectedUser(
                                       e
                                      )
                                      /* istanbul ignore next */
                                      setRatingData({
                                        ...ratingData,
                                        userEmail: e.id,
                                      });
                                    }}
                                    data-testid="traineesCombo"
                                  >
                                    <div className="flex flex-col col-span-6 md:col-span-1">
                                      <Combobox.Label className="text-lg  font-bold pr-2 ">
                                        {t('Trainee')}
                                      </Combobox.Label>
                                      <div className="relative mt-0 md:mt-4">
                                        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-primary text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:text-sm">
                                          <Combobox.Input
                                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-primary text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                                            displayValue={(trainee: any) =>
                                              trainee?.email
                                            }
                                            onChange={(event) =>
                                              setQuery(event.target.value)
                                            }
                                            data-testid="traineeComboInput"
                                          />
                                          <Combobox.Button
                                            className="absolute inset-y-0 right-0 flex items-center pr-2"
                                            data-testid="traineeList"
                                          >
                                            <SelectorIcon
                                              className="h-5 w-5 text-white"
                                              aria-hidden="true"
                                            />
                                          </Combobox.Button>
                                        </div>
                                        <Transition
                                          as={Fragment}
                                          leave="transition ease-in duration-100"
                                          leaveFrom="opacity-100"
                                          leaveTo="opacity-0"
                                          afterLeave={() => setQuery('')}
                                        >
                                          <Combobox.Options className="z-20 absolute mt-1 ml-auto max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            <Combobox.Option
                                              key={trainee.id}
                                              className={`relative cursor-default select-none py-2 pl-10 pr-4 bg-gray-200 text-gray-900`}
                                              value={trainee.id}
                                              disabled={true}
                                            >
                                              <span
                                                className={`block truncate font-medium`}
                                              >
                                                {t('Select Trainee')}
                                              </span>
                                            </Combobox.Option>
                                            {filteredTrainees?.length === 0 &&
                                            query !== '' ? (
                                              <div
                                                className="relative cursor-default select-none py-2 px-4 text-gray-700"
                                                data-testid="notFoundDiv"
                                              >
                                                {t('No trainee found.')}
                                              </div>
                                            ) : (
                                              filteredTrainees?.map(
                                                (trainee: any) => (
                                                  <Combobox.Option
                                                    data-testid="traineeOption"
                                                    key={trainee?.id}
                                                    className={({ active }) =>
                                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                        active
                                                          ? 'bg-primary text-white'
                                                          : 'text-gray-900'
                                                      }`
                                                    }
                                                    value={trainee}
                                                  >
                                                    {({ selected, active }) => (
                                                      <>
                                                        <span
                                                          className={`block truncate ${
                                                            selected
                                                              ? 'font-medium'
                                                              : 'font-normal'
                                                          }`}
                                                        >
                                                          {trainee?.email}
                                                        </span>
                                                        {selected ? (
                                                          <span
                                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                              active
                                                                ? 'text-white'
                                                                : 'text-primary'
                                                            }`}
                                                          >
                                                            <CheckIcon
                                                              className="h-5 w-5"
                                                              aria-hidden="true"
                                                            />
                                                          </span>
                                                        ) : null}
                                                      </>
                                                    )}
                                                  </Combobox.Option>
                                                ),
                                              )
                                            )}
                                          </Combobox.Options>
                                        </Transition>
                                      </div>
                                    </div>
                                  </Combobox>
                                  {/* SELECT TRAINEE DROPDOWN END */}

                                  

                                  {/* SELECT SPRINT  DROPDOWN START */}
                                  <div className="flex flex-col ml-auto col-span-0 md:col-span-3">
                                    <Listbox
                                      value={selectedSprint}
                                      onChange={setSelectedSprint}
                                    >
                                      {({ open }) => (
                                        <>
                                          <Listbox.Label className="block text-lg font-bold mt-2">
                                            {t(' Sprint')}
                                          </Listbox.Label>
                                          <div className="relative mt-1 w-full">
                                            <Listbox.Button
                                              data-testid="sprintList"
                                              className="relative w-full cursor-default rounded-md border border-primary bg-primary py-2 pl-3 pr-10 text-left shadow-sm focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm"
                                            >
                                              <span className="flex items-center">
                                                <span className="ml-3 block truncate text-white">
                                                  {selectedSprint.name}
                                                </span>
                                              </span>
                                              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                                <SelectorIcon
                                                  className="h-5 w-5 text-white"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            </Listbox.Button>
                                            <Transition
                                              show={open}
                                              as={Fragment}
                                              leave="transition ease-in duration-100"
                                              leaveFrom="opacity-100"
                                              leaveTo="opacity-0"
                                            >
                                              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {sprint.map((sprint) => (
                                                  <Listbox.Option
                                                    key={sprint.id}
                                                    className={({ active }) =>
                                                      classNames(
                                                        active
                                                          ? 'text-white bg-primary'
                                                          : 'text-gray-900',
                                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                                      )
                                                    }
                                                    value={sprint}
                                                  >
                                                    {({ selected, active }) => (
                                                      <>
                                                        <div className="flex items-center">
                                                          <span
                                                            className={classNames(
                                                              selected
                                                                ? 'font-semibold'
                                                                : 'font-normal',
                                                              'ml-3 block truncate',
                                                            )}
                                                          >
                                                            {sprint.name}
                                                          </span>
                                                        </div>
                                                        {selected ? (
                                                          <span
                                                            className={classNames(
                                                              active
                                                                ? 'text-white'
                                                                : 'text-primary',
                                                              'absolute inset-y-0 right-0 flex items-center pr-4',
                                                            )}
                                                          >
                                                            <CheckIcon
                                                              className="h-5 w-5"
                                                              aria-hidden="true"
                                                            />
                                                          </span>
                                                        ) : null}
                                                      </>
                                                    )}
                                                  </Listbox.Option>
                                                ))}
                                              </Listbox.Options>
                                            </Transition>
                                          </div>
                                        </>
                                      )}
                                    </Listbox>
                                  </div>

                                  {/* SELECT SPRINT DROPDOWN END. */}
                                </div>
                                
                                <div className="bg-gray-100 dark:bg-dark-frame-bg rounded-md p-2 my-2 mt-6 md:mt-8 flex flex-col md:flex-row">
                                  <div className="mx-0 md:mx-2 my-1 w-full flex flex-col md:flex-col justify-start items-center ">
                                    <Button
                                      variant="default"
                                      size="md"
                                      style="text-center w-full rounded-lg bg-gray-700 text-white focus:outline-none p-1 md:p-2"
                                    >
                                      {t(' Quality')}
                                    </Button>
                                    <div className="flex flex-col justify-start items-start w-full my-0 md:my-2">
                                      <select
                                        name="quality"
                                        value={ratingData.quality}
                                        onChange={(e) =>
                                          setRatingData({
                                            ...ratingData,
                                            quality: e.target.value,
                                          })
                                        }
                                        id="qualityRating"
                                        className="rounded-md appearance-none relative block w-full px-3 py-2 border dark:bg-dark-bg border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm  dark:text-dark-text-fill dark:border-white "
                                      >
                                        <option value="-1" disabled>
                                          {t('Select rating')}
                                        </option>
                                        <>
                                        {defaultGrading?.map(
                                          (grade: any) => <option>{grade}</option>
                                        )}
                                        </>
                                      </select>
                                    </div>
                                    <textarea
                                      onChange={(e) =>
                                        setRatingData({
                                          ...ratingData,
                                          qualityRemark: e.target.value,
                                        })
                                      }
                                      id=""
                                      rows={5}
                                      className="rounded-md w-full my-1 md:my-3  p-3 border dark:bg-dark-bg sm:text-sm  dark:text-dark-text-fill dark:border-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10"
                                      placeholder={t('Quality ratings remark')}
                                      name="qualityDescription"
                                      data-testid="qualityDescriptionTextArea"
                                    />
                                  </div>
                                  <div className="mx-0 md:mx-2  my-1 w-full flex flex-col md:flex-col justify-start items-center ">
                                    <Button
                                      variant="default"
                                      size="md"
                                      style="text-center w-full rounded-lg bg-gray-700 text-white focus:outline-none p-1 md:p-2"
                                    >
                                      {t('Quantity')}
                                    </Button>
                                    <div className="flex flex-col justify-start items-start w-full my-0 md:my-2">
                                    
                                      <select
                                        name="quantity"
                                        id="quantityRating"
                                        value={ratingData.quantity}
                                        onChange={(e) =>
                                          setRatingData({
                                            ...ratingData,
                                            quantity: e.target.value,
                                          })
                                        }
                                        className="rounded-md appearance-none relative block w-full px-3 py-2 border dark:bg-dark-bg border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm  dark:text-dark-text-fill dark:border-white "
                                      >
                                        
                                        <option value="-1" disabled>
                                          {t('Select rating')}
                                         
                                        </option>
                                        <>
                                        {defaultGrading?.map(
                                          (grade: any) => <option>{grade}</option>
                                        )}
                                        </>
                                      </select>
                                    </div>
                                    <textarea
                                      name="quantityDescription"
                                      id=""
                                      onChange={(e) =>
                                        setRatingData({
                                          ...ratingData,
                                          quantityRemark: e.target.value,
                                        })
                                      }
                                      rows={5}
                                      className="rounded-md w-full  my-1 md:my-3  p-3 border dark:bg-dark-bg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm  dark:text-dark-text-fill dark:border-white"
                                      placeholder={t('Quantity rating remark')}
                                    />
                                  </div>
                                  <div className="mx-0 md:mx-2 my-1 w-full flex flex-col md:flex-col justify-start items-center ">
                                    <Button
                                      variant="default"
                                      size="md"
                                      style="text-center w-full rounded-lg bg-gray-700 text-white focus:outline-none p-1 md:p-2"
                                    >
                                      {t('Professionalism')}
                                    </Button>
                                    <div className="flex flex-col justify-start items-start w-full my-0 md:my-2">
                                      <select
                                        name="professional"
                                        id="qualityRating"
                                        value={ratingData.professional}
                                        onChange={handleRatingChange}
                                        className="rounded-md appearance-none relative block w-full px-3 py-2 border dark:bg-dark-bg border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm  dark:text-dark-text-fill dark:border-white "
                                      >
                                        <option value="-1" disabled>
                                          {t('Select rating')}
                                        </option>
                                        <>
                                        {defaultGrading?.map(
                                          (grade: any) => <option>{grade}</option>
                                        )}
                                        </>
                                      </select>
                                    </div>
                                    <textarea
                                      name="proffessionalDescription"
                                      id=""
                                      onChange={(e) =>
                                        setRatingData({
                                          ...ratingData,
                                          professionalRemark: e.target.value,
                                        })
                                      }
                                      rows={5}
                                      className="rounded-md w-full my-1 md:my-3  p-3 border dark:bg-dark-bg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm  dark:text-dark-text-fill dark:border-white"
                                      placeholder={t(
                                        'Professional rating remark',
                                      )}
                                    />
                                  </div>
                                </div>
                                <div className="mt-4 md:mt-8">
                                  <button
                                    type="button"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-400 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    onClick={closeCancel}
                                  >
                                    {t('Cancel')}
                                  </button>
                                  <button
                                    type="submit"
                                    className="inline-flex justify-center float-right rounded-md border border-transparent  bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    onClick={closeModal}
                                    disabled={disable}
                                  >
                                    {t('Save ratings')}
                                  </button>
                                </div>
                              </form>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition>
                  {/* ADD NEW RATING MODAL END */}

                  {/* UPDATE MODAL START */}
                  <Transition
                    appear
                    show={showActions}
                    as={Fragment}
                    data-testid="modalTransistion"
                  >
                    <Dialog
                      as="div"
                      className="relative z-10"
                      onClose={closeModal}
                    >
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                      </Transition.Child>
                      <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full  items-center justify-center p-4 text-center">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Dialog.Panel className="w-full overflow-auto lg:mx-60 xl:mx-96 h-[800px] md:h-[500px] transform  rounded-2xl bg-white dark:bg-dark-bg p-6 text-left align-middle shadow-xl transition-all">
                              <form onSubmit={handleUpdate}>
                                <Dialog.Title
                                  as="h3"
                                  className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-text-fill"
                                >
                                  {t('Update rating')}
                                </Dialog.Title>
                                <div className="bg-gray-100 dark:bg-dark-frame-bg rounded-md p-2 my-2 mt-6 md:mt-8 flex flex-col md:flex-row">
                                  <div className="mx-0 md:mx-2 my-1 w-full flex flex-col md:flex-col justify-start items-center ">
                                    <Button
                                      variant="default"
                                      size="md"
                                      style="text-center w-full rounded-lg bg-gray-700 text-white focus:outline-none p-1 md:p-2"
                                    >
                                      {t('Quality')}
                                    </Button>
                                    <div className="flex flex-col justify-start items-start w-full my-0 md:my-2">
                                      <select
                                        name="quality"
                                        value={rows.quality}
                                        onChange={(e) => {
                                          setRows({
                                            ...rows,
                                            quality: e.target.value,
                                          });
                                        }}
                                        id="qualityRating"
                                        className="rounded-md appearance-none relative block w-full px-3 py-2 border dark:bg-dark-bg border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm  dark:text-dark-text-fill dark:border-white "
                                      >
                                        <option value="-1" disabled>
                                          {t('Select rating')}
                                        </option>
                                        <>
                                        {defaultGrading?.map(
                                          (grade: any) => <option>{grade}</option>
                                        )}
                                        </>
                                      </select>
                                    </div>
                                    <textarea
                                      value={rows.qualityremark}
                                      onChange={(e) =>
                                        setRows({
                                          ...rows,
                                          qualityremark: e.target.value,
                                        })
                                      }
                                      id=""
                                      rows={5}
                                      className="rounded-md w-full my-1 md:my-3  p-3 border dark:bg-dark-bg sm:text-sm  dark:text-dark-text-fill dark:border-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10"
                                      placeholder="Quality ratings remark"
                                      name="qualityDescription"
                                      data-testid="qualityDescriptionTextArea"
                                    />{' '}
                                  </div>
                                  <div className="mx-0 md:mx-2  my-1 w-full flex flex-col md:flex-col justify-start items-center ">
                                    <Button
                                      variant="default"
                                      size="md"
                                      style="text-center w-full rounded-lg bg-gray-700 text-white focus:outline-none p-1 md:p-2"
                                    >
                                      {t('Quantity')}
                                    </Button>
                                    <div className="flex flex-col justify-start items-start w-full my-0 md:my-2">
                                      <select
                                        name="quantity"
                                        id="quantityRating"
                                        value={rows.quantity}
                                        onChange={(e) =>
                                          setRows({
                                            ...rows,
                                            quantity: e.target.value,
                                          })
                                        }
                                        className="rounded-md appearance-none relative block w-full px-3 py-2 border dark:bg-dark-bg border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm  dark:text-dark-text-fill dark:border-white "
                                      >
                                        <option value="-1" disabled>
                                          {t('Select rating')}
                                        </option>
                                        <>
                                        {defaultGrading?.map(
                                          (grade: any) => <option>{grade}</option>
                                        )}
                                        </>
                                      </select>
                                    </div>
                                    <textarea
                                      name="quantityDescription"
                                      id=""
                                      value={rows.quantityremark}
                                      onChange={(e) =>
                                        setRows({
                                          ...rows,
                                          quantityremark: e.target.value,
                                        })
                                      }
                                      rows={5}
                                      className="rounded-md w-full  my-1 md:my-3  p-3 border dark:bg-dark-bg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm  dark:text-dark-text-fill dark:border-white"
                                      placeholder="Quantity rating remark"
                                    />
                                  </div>
                                  <div className="mx-0 md:mx-2 my-1 w-full flex flex-col md:flex-col justify-start items-center ">
                                    <Button
                                      variant="default"
                                      size="md"
                                      style="text-center w-full rounded-lg bg-gray-700 text-white focus:outline-none p-1 md:p-2"
                                    >
                                      {t('Professionalism')}
                                    </Button>
                                    <div className="flex flex-col justify-start items-start w-full my-0 md:my-2">
                                      <select
                                        name="professional"
                                        id="qualityRating"
                                        value={rows.professional}
                                        onChange={(e) =>
                                          setRows({
                                            ...rows,
                                            professional: e.target.value,
                                          })
                                        }
                                        className="rounded-md appearance-none relative block w-full px-3 py-2 border dark:bg-dark-bg border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm  dark:text-dark-text-fill dark:border-white "
                                      >
                                        <option value="-1" disabled>
                                          {t('Select rating')}
                                        </option>
                                        <>
                                        {defaultGrading?.map(
                                          (grade: any) => <option>{grade}</option>
                                        )}
                                        </>
                                      </select>
                                    </div>
                                    <textarea
                                      name="proffessionalDescription"
                                      id=""
                                      value={rows.professionalRemark}
                                      onChange={(e) =>
                                        setRows({
                                          ...rows,
                                          professionalRemark: e.target.value,
                                        })
                                      }
                                      rows={5}
                                      className="rounded-md w-full my-1 md:my-3  p-3 border dark:bg-dark-bg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm  dark:text-dark-text-fill dark:border-white"
                                      placeholder="Professional rating remark"
                                    />
                                  </div>
                                </div>
                                <div className="mt-4 md:mt-8">
                                  <button
                                    type="submit"
                                    className="inline-flex justify-center float-right rounded-md border border-transparent  bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                  >
                                    {t('Save')}
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-400 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    onClick={closeCancel}
                                  >
                                    {t('Cancel')}
                                  </button>
                                </div>
                              </form>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition>
                  {/* UPDATE MODAL END */}

                  {/* REMARKS MODEL START */}
                  <Transition
                    appear
                    show={showRemarks}
                    as={Fragment}
                    data-testid="modalTransistion"
                  >
                    <Dialog
                      as="div"
                      className="relative z-10"
                      onClose={closeModal}
                    >
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                      </Transition.Child>
                      <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full  items-center justify-center p-4 text-center">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Dialog.Panel className="w-full overflow-auto lg:mx-60 xl:mx-96 h-[800px] md:h-[460px] transform  rounded-2xl bg-white dark:bg-dark-bg p-6 text-left align-middle shadow-xl transition-all">
                              <form onSubmit={handleUpdate}>
                                <Dialog.Title
                                  as="h3"
                                  className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-text-fill items-center"
                                >
                                  {t('Remarking Conversation')}
                                </Dialog.Title>
                                <div className="bg-gray-100 dark:bg-dark-frame-bg rounded-md p-2 my-2 mt-6 md:mt-8 flex flex-col md:flex-row">
                                  <div className="mx-0 md:mx-2 my-1 w-full flex flex-col md:flex-col justify-start items-center ">
                                    <textarea
                                      value={rows.qualityremark}
                                      id=""
                                      rows={5}
                                      className="rounded-md w-full my-1 md:my-3  p-3 border dark:bg-dark-bg sm:text-sm  dark:text-dark-text-fill dark:border-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10"
                                      placeholder="No quality ratings remark"
                                      name="qualityDescription"
                                      data-testid="qualityDescriptionTextArea"
                                    />

                                    <div className="rounded-md relative w-full bg-white border-none border dark:bg-dark-bg sm:text-sm  dark:text-dark-text-fill dark:border-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10">
                                      <textarea
                                        className="rounded-md w-full h-full p-3 border dark:bg-dark-bg sm:text-sm  dark:text-dark-text-fill focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10"
                                        rows={2}
                                        placeholder="No reply here"
                                        value={rows.bodyQuality}
                                      />
                                    </div>
                                  </div>
                                  <div className="mx-0 md:mx-2  my-1 w-full flex flex-col md:flex-col justify-start items-center ">
                                    <textarea
                                      name="quantityDescription"
                                      id=""
                                      value={rows.quantityremark}
                                      rows={5}
                                      className="rounded-md w-full  my-1 md:my-3  p-3 border dark:bg-dark-bg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm  dark:text-dark-text-fill dark:border-white"
                                      placeholder=" No quantity rating remark"
                                    />
                                    <div className="rounded-md relative w-full bg-white border-none border dark:bg-dark-bg sm:text-sm  dark:text-dark-text-fill dark:border-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10">
                                      <textarea
                                        className="rounded-md w-full h-full p-3 border dark:bg-dark-bg sm:text-sm  dark:text-dark-text-fill focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10"
                                        value={rows.bodyQuantity}
                                        rows={2}
                                        placeholder="No reply here"
                                      />
                                    </div>
                                  </div>
                                  <div className="mx-0 md:mx-2 my-1 w-full flex flex-col md:flex-col justify-start items-center ">
                                    <textarea
                                      name="proffessionalDescription"
                                      id=""
                                      value={rows.professionalRemark}
                                      rows={5}
                                      className="rounded-md w-full my-1 md:my-3  p-3 border dark:bg-dark-bg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm  dark:text-dark-text-fill dark:border-white"
                                      placeholder="No professional rating remark"
                                    />
                                    <div className="rounded-md relative w-full bg-white border-none border dark:bg-dark-bg sm:text-sm  dark:text-dark-text-fill dark:border-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10">
                                      <textarea
                                        value={rows.bodyProfessional}
                                        placeholder="No reply here"
                                        className="rounded-md w-full h-full p-3 border dark:bg-dark-bg sm:text-sm  dark:text-dark-text-fill focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10"
                                        rows={2}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 md:mt-8">
                                  <button
                                    type="button"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-red-400 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    onClick={closeModal}
                                  >
                                    {t('Close')}
                                  </button>
                                </div>
                              </form>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition>
                  {/* REMARKS MODEL END */}
                </div>
                <div className="w-full">
                  <div>
                    <div className="bg-light-bg dark:bg-dark-frame-bg min-h-screen overflow-y-auto overflow-x-hidden">
                      <div className="px-3 md:px-8 mt-10">
                        {data == 0 ? (
                          
                          <div className="text-center mt-7 text-lg uppercase">
                            <p> {t('No ratings data found')}</p>

                            {/* <Square /> */}
                          </div>
                          
                        ) : (
                          <DataTable
                            data={vardata}
                            columns={columns}
                            title={t('Performance Ratings')}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TraineeRatingDashboard;
