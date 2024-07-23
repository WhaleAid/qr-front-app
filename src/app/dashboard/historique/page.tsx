"use client"

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import NoData from '@/components/ui/no-data';
import { Vortex } from 'react-loader-spinner';
import { formatDate } from '@/utils/dateUtils';
import { Campaign } from '@/app/types/campaign';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useGetMeQuery } from '@/services/userService';
import { useGetMyGenerationHistoryQuery, useGetMyGenerationsQuery, useGetMyImageHistoryQuery, useVoteGenerationMutation } from '@/services/generationService';
import { useVoteImageMutation } from '@/services/imageService';

export default function Historique() {

    const { data: userInfo, error: errorUserInfo, isLoading: isLoadingUserInfo } = useGetMeQuery()
    const { data: generations, error: errorGenerations, isLoading: isLoadingGenerations } = useGetMyGenerationHistoryQuery();
    const { data: images, error: errorImages, isLoading: isLoadingImages } = useGetMyImageHistoryQuery();
    const [voteGeneration, { data: voteData, error: voteError, isLoading: voteLoading }] = useVoteGenerationMutation();
    const [voteImage, { data: voteImageData, error: voteImageError, isLoading: voteImageLoading }] = useVoteImageMutation();

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.common.black,
            fontFamily: 'Poppins',
        },
        [`&.${tableCellClasses.body}`]: {
            fontFamily: 'Poppins',
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    function createData(
        _id: string,
        text: string,
        campaignDescription: string,
        campaignTitle: string,
        createdAt: string,
        valid: boolean,
    ) {
        return { _id, text, campaignDescription, campaignTitle, createdAt, valid };
    }

    let rows = generations?.map((generation) => createData(generation._id, generation.text, (generation.campaign as Campaign).description, (generation.campaign as Campaign).name, generation.createdAt, generation.valid)) || []
    rows = rows.concat(images?.map((image) => createData(image._id, image.image, (image.campaign as Campaign).description, (image.campaign as Campaign).name, image.createdAt, image.valid)) || [])
    rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <div className="p-8 lg:pt-8 pt-16 w-full flex flex-col">
            <div>
                <h1 className="font-bold text-2xl text-black">Historiques</h1>
                <p className="text-gray-600 text-sm mt-2">Ici vous verrez l'historique de toutes les créations voté.</p>
            </div>
            {
                isLoadingGenerations ? (
                    <div className='w-full m-auto flex justify-center flex-col items-center gap-4'>
                        <Vortex
                            visible={true}
                            height="100"
                            width="100"
                            ariaLabel="vortex-loading"
                            wrapperStyle={{}}
                            wrapperClass="vortex-wrapper"
                            colors={['#7A63EB', '#5C9BEB', '#7A63EB', '#5C9BEB', '#7A63EB', '#5C9BEB']}
                        />
                        <span className='text-black font-bold text-xl drop-shadow-md'>
                            Chargement...
                        </span>
                    </div>
                ) : errorGenerations ? (
                    <div className='w-full m-auto flex justify-center flex-col items-center gap-4'>
                        <span className='text-black font-bold text-xl drop-shadow-md'>
                            Une erreur s'est produite
                        </span>
                    </div>
                ) : rows.length === 0 ? (
                    <div className='w-full m-auto flex justify-center flex-col items-center gap-4'>
                        <NoData width={'15rem'} height={'15rem'} />
                        <span className='text-black font-bold text-xl drop-shadow-md text-center'>
                            Aucune campagne disponible
                        </span>
                    </div>
                ) : (
                    <TableContainer component={Paper} className='mt-6'>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Nom de la campagne</StyledTableCell>
                                    <StyledTableCell>Texte généré</StyledTableCell>
                                    <StyledTableCell>Description</StyledTableCell>
                                    <StyledTableCell>Crée le</StyledTableCell>
                                    <StyledTableCell>État</StyledTableCell>
                                    <StyledTableCell>Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <StyledTableRow key={row.text} className='cursor-pointer'>
                                        <StyledTableCell component="th" scope="row">
                                            {
                                                row.campaignTitle.length > 35 ? row.campaignTitle.substring(0, 35) + '...' : row.campaignTitle
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row">
                                            {
                                                row.text.startsWith('http') ? (
                                                    <img src={row.text} alt='image' className='w-40 h-40 rounded' />
                                                ) : (
                                                    row.text.length > 35 ? row.text.substring(0, 35) + '...' : row.text
                                                )
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {
                                                row.campaignDescription.length > 35 ? row.campaignDescription.substring(0, 35) + '...' : row.campaignDescription
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell>{formatDate(row.createdAt)}</StyledTableCell>
                                        <StyledTableCell>{row.valid ? (
                                            <FontAwesomeIcon icon={faCheck} className='text-green-500 text-xl' />
                                        ) : (
                                            <FontAwesomeIcon icon={faTimes} className='text-red-500 text-xl' />
                                        )}</StyledTableCell>
                                        <StyledTableCell>
                                            <button className='bg-primary text-white py-2 px-3 rounded-full hover:bg-primary-dark transition-all duration-300 ease-in-out'
                                                onClick={() => {
                                                    row.text.startsWith('http') ? voteImage({ imageId: row._id, vote: !row.valid }) : voteGeneration({ generationId: row._id, vote: !row.valid })
                                                }}
                                            >
                                                {
                                                    row.valid ? 'Refuser' : 'Valider'
                                                }
                                            </button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
            }
        </div>
    );
}