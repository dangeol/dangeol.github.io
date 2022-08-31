import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';

const propTypes = {
  ...SectionSplitProps.types
}

const defaultProps = {
  ...SectionSplitProps.defaults
}

const FeaturesSplit = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  imageFill,
  ...props
}) => {

  const outerClasses = classNames(
    'features-split section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-split-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const splitClasses = classNames(
    'split-wrap',
    invertMobile && 'invert-mobile',
    invertDesktop && 'invert-desktop',
    alignTop && 'align-top'
  );

  const sectionHeader = {
    title: 'Start your new career today with Job in Germany!',
    paragraph: 'With Job application training for Germany, you can be sure that you are fully prepared to find the best job possible in Germany. The program offers individual coaching and access to exclusive resources, so you can confidently apply for jobs and get hired quickly. Learning German will also give you an edge over other applicants.'
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={splitClasses}>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Now is your time
                  </div>
                <h3 className="mt-0 mb-12">
                  Invest in your future
                  </h3>
                <p className="m-0">
                  Germany's skilled labor shortage is no secret. The country currently has the lowest unemployment rate since reunification, and industries are struggling to find workers with the right skills. 
                  While Germany has been working to train its own citizens to fill these jobs, the process takes time. In the meantime, businesses are looking for workers from other countries to come and fill the skills gap. 
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/stefan-widua-iPOZf3tQfHA-unsplash_modif.jpg')}
                  alt="Features split 01"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Start your transition now
                  </div>
                <h3 className="mt-0 mb-12">
                  What we offer
                  </h3>
                <ul className="m-0">
                  <li>We will help you assess your skills and interests to find a career that is the best fit for you in Germany.</li>
                  <li>We are here to help every step of the way, from preparing your resume and cover letter, to interviewing tips, and everything in between!</li>
                  <li>Help with the Visa application process and recognition of professional qualifications.</li>
                  <li>German language courses as individual 1:1 lessons, taylored to your specific needs.</li>
                </ul>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/charlesdeluvio-Lks7vei-eAg-unsplash.jpg')}
                  alt="Features split 02"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Your job coach
                  </div>
                <h3 className="mt-0 mb-12">
                  Daniel's bio
                  </h3>
                <p className="m-0">
                Born and raised in Germany, Daniel has always had a passion for helping foreigners to get integrated into German society. 
                After completing his studies in Environmental Science, he began his career as an environmental consultant and now has more than twelve years of 
                professional working experience in top-tier consulting firms both in Germany and abroad. Always looking for new challenges, 
                Daniel decided to take on a new adventure and to help people to find their career in Germany.  
                When not working, Daniel enjoys playing the piano and travelling to new places.
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/DSC05273_modif.JPG')}
                  alt="Features split 03"
                  width={528}
                  height={396} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

FeaturesSplit.propTypes = propTypes;
FeaturesSplit.defaultProps = defaultProps;

export default FeaturesSplit;