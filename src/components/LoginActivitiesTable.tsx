/* eslint-disable no-use-before-define */
/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_LOGIN_ACTIVITIES } from '../Mutations/manageStudentMutations';

interface LoginActivitiesData {
  loginActivities: LoginActivity[];
}

interface Profile {
  __typename: string;
  activity: any[];
}

interface Response {
  getProfile: Profile;
}

interface LoginActivity {
  date: string;
  country_name: string;
  city: string;
  state: string;
  IPv4: string;
  latitude: number;
  longitude: number;
  country_code: string;
  postal: string;
  failed: number;
}

const LoginActivitiesTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);

  const { loading, data, error } = useQuery<Response>(GET_LOGIN_ACTIVITIES);

  useEffect(() => {
    if (error) {
      setLoginActivities([]);
      console.log('Error retrieving login activities:', error);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      const profile = data.getProfile;

      if (profile && profile.activity && Array.isArray(profile.activity)) {
        console.log(profile.activity);

        // Create a copy of the profile.activity array before sorting it
        const sortedActivities = [...profile.activity].sort((a, b) => {
          const dateA = a?.date ?? '';
          const dateB = b?.date ?? '';

          return dateA > dateB ? -1 : 1;
        });

        // Use reduce to filter out duplicates based on the date property
        const uniqueActivities = sortedActivities.reduce(
          (acc: LoginActivity[], activity: LoginActivity) => {
            const currentDate = activity?.date ?? ''; // Provide a default empty string if activity.date is null or undefined

            // Check if currentDate is not an empty string and if it's not already in the accumulator
            if (
              currentDate !== '' &&
              !acc.some((a) => a.date === currentDate)
            ) {
              acc.push(activity);
            }
            return acc;
          },
          [],
        );

        setLoginActivities(uniqueActivities);
      } else {
        // Handle cases when profile or profile.activity is null or not an array
        setLoginActivities([]);
      }
    }
  }, [data]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleGoBack = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const pageSize = 10;
  const totalActivities = loginActivities.length;
  const totalPages = Math.ceil(totalActivities / pageSize);

  // Calculate the start and end index for the current page
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalActivities);

  // Get the activities to display on the current page
  const displayActivities = loginActivities.slice(startIndex, endIndex);

  if (loading && page === 1) {
    return <div>Loading login activities...</div>;
  }

  if (error) {
    return <div>Error retrieving login activities.</div>;
  }

  if (displayActivities.length === 0) {
    return <div>No login activities yet.</div>;
  }

  return (
    <div className="mt-4 flex flex-col items-center">
      <table className="flex flex-col flex-wrap w-full pt-[6em] justify-end pl-0 lg:pl-[10em] ">
        {/* Render login activities from the loginActivities state */}
        <thead className="flex w-full justify-evenly flex-wrap ">
          <tr className="flex w-full text-[#148fb6]">
            <th className="w-[15%]">Country Name</th>
            <th className="w-[25%]">Date</th>
            <th className="w-[15%]">City</th>
            <th className="w-[15%]">State</th>
            <th className="w-[15%]">IPv4</th>
            <th className="w-[15%]">Longitude</th>
          </tr>
        </thead>

        <tbody className="flex flex-col flex-wrap my-2 ">
          {displayActivities.map((activity) => (
            <tr
              className="w-full flex flex-wrap lg:pl-[3em] pt-2"
              key={activity.country_name}
            >
              <td className="md:w-[15%] border-r border-[#148fb6]">
                {activity.country_name}
              </td>
              <td className="md:w-[25%] border-r border-[#148fb6]">
                {new Date(activity.date).toLocaleString()}{' '}
                {/* Convert UTC date to local time */}
              </td>
              <td className="md:w-[15%] border-r border-[#148fb6]">
                {activity.city}
              </td>
              <td className="md:w-[15%] border-r border-[#148fb6]">
                {activity.state}
              </td>
              <td className="md:w-[20%] border-r border-[#148fb6]">
                {activity.IPv4}
              </td>
              <td className="md:w-[10%] ">{activity.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination at the bottom of the page */}
      <div className="flex justify-center mb-20">
        <span className="text-gray-600 mr-2">
          Page {page} of {totalPages}
        </span>
        {page > 1 && (
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleGoBack}
          >
            Previous
          </button>
        )}
        {page < totalPages && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
            onClick={handleLoadMore}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginActivitiesTable;
