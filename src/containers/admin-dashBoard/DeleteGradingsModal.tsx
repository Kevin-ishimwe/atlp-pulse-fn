import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from '../../components/Buttons';
import { Cohort } from './Cohorts';

export default function DeleteGradingsModal({
  deleteGradingModal,
  removeModel,
  deleteFunc,
  setValue,
}: {
  deleteGradingModal: boolean;
  removeModel: Function;
  deleteFunc: Function;
  setValue: Function;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`h-screen w-screen bg-black fixed bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto mt-10 p-4 ${
        deleteGradingModal === true ? 'block' : 'hidden'
      }`}
    >
      <div className="bg-white dark:bg-dark-bg w-screen md:w-1/2  xl:w-4/12 rounded-lg p-4 pb-8">
        <div className="card-title w-full flex  flex-wrap justify-center items-center  ">
          <h3 className="font-bold text-xl dark:text-white text-center w-11/12">
            {t('DeleteGRADINGSYSTEM')}
          </h3>
          <hr className=" bg-primary border-b my-3 w-full" />
        </div>
        <div className="card-body">
          <form className=" py-3 px-8">
            <div>
              <h2 className="text-base dark:text-white text-center m-4">
                {t('reallyRemoveGrading')}
              </h2>
            </div>
            <div className="w-full flex justify-between">
              <Button
                variant="info"
                size="sm"
                style="w-[30%] md:w-1/4 text-sm font-sans"
                data-testid="delete"
                 /* istanbul ignore next */
                onClick={
                   /* istanbul ignore next */
                  () => removeModel()}
              >
                {t('Cancel')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                style="w-[30%] md:w-1/4 text-sm font-sans"
                data-testid="confirmDeleteBtn"
                onClick={
                   /* istanbul ignore next */
                  () => {
                  /* istanbul ignore next */
                  deleteFunc();
                  /* istanbul ignore next */
                  setValue('');
                }}
              >
                {t('Delete')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
