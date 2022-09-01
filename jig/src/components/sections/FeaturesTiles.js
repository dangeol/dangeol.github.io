import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';
import featureTileIcon01 from './../../assets/images/feature-tile-icon-01.svg';
import featureTileIcon02 from './../../assets/images/feature-tile-icon-02.svg';
import featureTileIcon03 from './../../assets/images/feature-tile-icon-03.svg';
import featureTileIcon04 from './../../assets/images/feature-tile-icon-04.svg';
import featureTileIcon05 from './../../assets/images/feature-tile-icon-05.svg';
import featureTileIcon06 from './../../assets/images/feature-tile-icon-06.svg';

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}
const FeaturesTiles = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {

  const outerClasses = classNames(
    'features-tiles section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-tiles-inner section-inner pt-0',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const tilesClasses = classNames(
    'tiles-wrap center-content',
    pushLeft && 'push-left'
  );

  const sectionHeader = {
    title: 'Are you looking for a job in Germany?',
    paragraph: 'Job application training for Germany is the perfect program for you. It’s 8 weeks of 1:1 coaching that will prepare you to find the next opportunity that’s a perfect fit for your career. You will also learn German language skills which are essential when looking for a job in Germany.'    
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>

            <div className="tiles-item reveal-from-bottom">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Image
                      src={featureTileIcon01}
                      alt="Features tile icon 01"
                      width={64}
                      height={64} />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    Evaluation of your situation
                    </h4>
                  <p className="m-0 text-sm">
                    We will evaluate your current situation, set your goals and develop an individual strategy. 
                    </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Image
                      src={featureTileIcon04}
                      alt="Features tile icon 02"
                      width={64}
                      height={64} />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    The skills Matrix
                    </h4>
                  <p className="m-0 text-sm">
                    You will learn about hard and soft skills and how to sell yourself to potential employers.
                    </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom" data-reveal-delay="400">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Image
                      src={featureTileIcon03}
                      alt="Features tile icon 03"
                      width={64}
                      height={64} />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    CV writing
                    </h4>
                  <p className="m-0 text-sm">
                    You will learn how to write your CV according to German standards.
                    </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Image
                      src={featureTileIcon02}
                      alt="Features tile icon 04"
                      width={64}
                      height={64} />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    Cover letter writing
                    </h4>
                  <p className="m-0 text-sm">
                    Write a cover letter according to German standards which stands out and maximazes attention from Recruiters.
                    </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Image
                      src={featureTileIcon05}
                      alt="Features tile icon 05"
                      width={64}
                      height={64} />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    Job interview preparation
                    </h4>
                  <p className="m-0 text-sm">
                    You will learn how to prepare for a job interview in Germany, including hands-on exercises, specifically tailored to your personqlity traits, skills and the job you are applying for.
                    </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom" data-reveal-delay="400">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Image
                      src={featureTileIcon06}
                      alt="Features tile icon 06"
                      width={64}
                      height={64} />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    Job interview simulation
                    </h4>
                  <p className="m-0 text-sm">
                    We'll simulate a typical job interview. You will be fully prepared for your next interview in Germany.
                    </p>
                </div>
              </div>
            </div>

            <div className="reveal-from-bottom" data-reveal-delay="600">
              <ButtonGroup>
                <Button tag="a" color="primary" wideMobile href="https://app.paperbell.com/checkout/bookings/new?package_id=31805">
                  Book a FREE call
                  </Button>
                <Button tag="a" color="dark" wideMobile href="https://app.paperbell.com/checkout/packages/29410">
                  Book a package
                  </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

FeaturesTiles.propTypes = propTypes;
FeaturesTiles.defaultProps = defaultProps;

export default FeaturesTiles;